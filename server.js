import express from 'express';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const YT_RE = /^https?:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//i;

app.get('/download', (req, res) => {
  const url = req.query.url;
  if (!url || typeof url !== 'string' || !YT_RE.test(url)) {
    res.status(400).type('text/plain').send('Invalid YouTube URL');
    return;
  }

  const yt = spawn('yt-dlp', [
    '-f', 'mp4/best[ext=mp4]/best',
    '--no-playlist',
    '--no-warnings',
    '-o', '-',
    url,
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  let headersSent = false;
  let stderr = '';

  yt.stdout.on('data', (chunk) => {
    if (!headersSent) {
      res.setHeader('Content-Disposition', 'attachment; filename="short.mp4"');
      res.setHeader('Content-Type', 'video/mp4');
      headersSent = true;
    }
    res.write(chunk);
  });

  yt.stderr.on('data', (chunk) => { stderr += chunk.toString(); });

  yt.on('error', (err) => {
    if (!headersSent) res.status(500).type('text/plain').send('yt-dlp failed: ' + err.message);
    else res.end();
  });

  yt.on('close', (code) => {
    if (code === 0) {
      res.end();
    } else if (!headersSent) {
      console.error('yt-dlp failed:', stderr);
      const msg = stderr.split('\n').filter((l) => l.startsWith('ERROR')).slice(-1)[0] || `yt-dlp exited with code ${code}`;
      res.status(500).type('text/plain').send(msg);
    } else {
      res.end();
    }
  });

  req.on('close', () => {
    if (!yt.killed) yt.kill('SIGKILL');
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Shorts downloader running on http://localhost:${PORT}`);
});
