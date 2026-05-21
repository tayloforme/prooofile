import React, { useState } from 'react';

const SLOTS = 4;
const SHORTS_LIKE_RE =
  /^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)[A-Za-z0-9_-]{6,}/i;

const initialRows = () =>
  Array.from({ length: SLOTS }, () => ({ url: '', status: 'idle', error: '' }));

function statusLabel(status) {
  switch (status) {
    case 'loading':
      return 'загрузка…';
    case 'done':
      return 'готово';
    case 'error':
      return 'ошибка';
    case 'invalid':
      return 'неверная ссылка';
    default:
      return '';
  }
}

async function downloadOne(url) {
  const resp = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
  if (!resp.ok) {
    let detail = '';
    try {
      const data = await resp.json();
      detail = data.error || '';
    } catch {
      /* ignore */
    }
    throw new Error(detail || `http_${resp.status}`);
  }

  const disposition = resp.headers.get('Content-Disposition') || '';
  const match = disposition.match(/filename="?([^"]+)"?/i);
  const filename = match ? match[1] : 'video.mp4';

  const blob = await resp.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

export default function App() {
  const [rows, setRows] = useState(initialRows);
  const [running, setRunning] = useState(false);

  const updateRow = (i, patch) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const onUrlChange = (i, value) =>
    setRows((prev) =>
      prev.map((r, idx) =>
        idx === i ? { ...r, url: value, status: 'idle', error: '' } : r
      )
    );

  const onClear = () => {
    if (running) return;
    setRows(initialRows());
  };

  const onDownload = async () => {
    if (running) return;
    const targets = rows
      .map((r, i) => ({ row: r, i }))
      .filter(({ row }) => row.url.trim().length > 0);

    if (targets.length === 0) return;

    setRunning(true);

    targets.forEach(({ row, i }) => {
      if (!SHORTS_LIKE_RE.test(row.url.trim())) {
        updateRow(i, { status: 'invalid', error: 'invalid_url' });
      } else {
        updateRow(i, { status: 'loading', error: '' });
      }
    });

    const jobs = targets
      .filter(({ row }) => SHORTS_LIKE_RE.test(row.url.trim()))
      .map(async ({ row, i }) => {
        try {
          await downloadOne(row.url.trim());
          updateRow(i, { status: 'done', error: '' });
        } catch (err) {
          updateRow(i, { status: 'error', error: err.message || 'error' });
        }
      });

    await Promise.allSettled(jobs);
    setRunning(false);
  };

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">YouTube Shorts Downloader</h1>
        <p className="subtitle">
          Вставь до {SLOTS} ссылок и нажми «Скачать». Каждое видео скачивается
          отдельным файлом.
        </p>

        <div className="rows">
          {rows.map((row, i) => (
            <div className="row" key={i}>
              <input
                type="url"
                className="input"
                placeholder="https://www.youtube.com/shorts/..."
                value={row.url}
                onChange={(e) => onUrlChange(i, e.target.value)}
                disabled={running}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
              />
              <span className={`status status--${row.status}`}>
                {statusLabel(row.status)}
              </span>
            </div>
          ))}
        </div>

        <div className="actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={onDownload}
            disabled={running}
          >
            {running ? 'Скачиваю…' : 'Скачать'}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onClear}
            disabled={running}
          >
            Очистить
          </button>
        </div>
      </div>
    </div>
  );
}
