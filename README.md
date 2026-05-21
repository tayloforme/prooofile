# YouTube Shorts Downloader

Локальный скачиватель YouTube Shorts: фронт на React + Vite, бэкенд на Express,
который вызывает `yt-dlp` и стримит mp4 в браузер.

## Требования

- Node.js 18+
- **yt-dlp** в PATH. Без него ничего не скачается — именно отсюда «ошибка» в UI.

### Установка yt-dlp

macOS:
```
brew install yt-dlp
```

Linux:
```
sudo apt install pipx && pipx install yt-dlp
# или
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

Windows (PowerShell):
```
winget install yt-dlp.yt-dlp
```

Проверка: `yt-dlp --version`.

## Запуск (dev)

```
npm install
npm run dev
```

- Vite поднимется на `http://localhost:5173`
- Express-бэкенд — на `http://localhost:3001` (Vite его проксирует через `/api`)

Открой `http://localhost:5173`, вставь до 4 ссылок на Shorts и нажми «Скачать».
Каждая ссылка скачивается отдельным файлом параллельно.

## Production build

```
npm run build
npm run start    # поднимает только бэкенд; статику отдавайте любым способом
```

## Проверка, что бэкенд видит yt-dlp

```
curl http://localhost:3001/api/health
# { "ok": true, "ytdlp": "2024.xx.xx" }
```

Если `ok: false` — поставь yt-dlp или укажи путь к бинарю переменной
`YTDLP_BIN`, например:
```
YTDLP_BIN=/opt/homebrew/bin/yt-dlp npm run server
```
