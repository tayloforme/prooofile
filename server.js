import express from 'express';
import { spawn } from 'node:child_process';

const app = express();
const PORT = process.env.PORT || 3001;
const YTDLP = process.env.YTDLP_BIN || 'yt-dlp';

const SHORTS_RE =
  /^https?:\/\/(?:www\.|m\.)?youtube\.com\/shorts\/[A-Za-z0-9_-]{6,}/i;
const WATCH_RE =
  /^https?:\/\/(?:www\.|m\.)?youtube\.com\/watch\?v=[A-Za-z0-9_-]{6,}/i;
const YOUTU_BE_RE = /^https?:\/\/youtu\.be\/[A-Za-z0-9_-]{6,}/i;

function isValidYouTubeUrl(url) {
  return SHORTS_RE.test(url) || WATCH_RE.test(url) || YOUTU_BE_RE.test(url);
}

function extractId(url) {
  const shorts = url.match(/shorts\/([A-Za-z0-9_-]+)/);
  if (shorts) return shorts[1];
  const watch = url.match(/[?&]v=([A-Za-z0-9_-]+)/);
  if (watch) return watch[1];
  const short = url.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
  if (short) return short[1];
  return 'video';
}

app.get('/api/download', (req, res) => {
  const url = String(req.query.url || '');
  if (!isValidYouTubeUrl(url)) {
    res.status(400).json({ error: 'invalid_url' });
    return;
  }

  const id = extractId(url);
  const filename = `${id}.mp4`;

  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${filename}"`
  );

  const args = [
    '--no-playlist',
    '--no-warnings',
    '--quiet',
    '-f',
    'best[ext=mp4]/mp4/best',
    '-o',
    '-',
    url,
  ];

  const child = spawn(YTDLP, args, { stdio: ['ignore', 'pipe', 'pipe'] });

  let stderr = '';
  child.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  child.on('error', (err) => {
    console.error('yt-dlp spawn error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'ytdlp_missing', detail: err.message });
    } else {
      res.destroy(err);
    }
  });

  child.stdout.pipe(res);

  child.on('close', (code) => {
    if (code !== 0) {
      console.error(`yt-dlp exited with ${code}: ${stderr}`);
      if (!res.headersSent) {
        res.status(500).json({ error: 'download_failed', detail: stderr });
      } else {
        res.end();
      }
    }
  });

  req.on('close', () => {
    if (!child.killed) child.kill('SIGTERM');
  });
});

app.get('/api/health', (_req, res) => {
  const child = spawn(YTDLP, ['--version']);
  let out = '';
  child.stdout.on('data', (c) => (out += c.toString()));
  child.on('error', () => res.json({ ok: false, ytdlp: null }));
  child.on('close', (code) =>
    res.json({ ok: code === 0, ytdlp: out.trim() || null })
  );
});

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
