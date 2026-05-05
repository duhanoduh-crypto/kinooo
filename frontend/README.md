# Kinoclone — Frontend (Vite + React + TypeScript)

Веб-интерфейс приложения Kinoclone: каталог фильмов, личная коллекция, расписание
сеансов, персональные рекомендации, админ-панель.

## Стек

- React 18, TypeScript, Vite 5
- Tailwind CSS, shadcn/ui (Radix UI)
- React Router v6, TanStack Query, React Hook Form + Zod
- Framer Motion, Recharts, Lucide

## Локальный запуск

```bash
cd frontend
cp .env.example .env   # при необходимости подправьте VITE_API_BASE_URL
npm install
npm run dev
```

По умолчанию Vite поднимется на `http://localhost:5173` и проксирует `/api`
на Django dev-сервер на `http://localhost:8000` (см. `vite.config.ts`).

## Скрипты

- `npm run dev` — dev-сервер с HMR.
- `npm run build` — продовая сборка в `dist/`.
- `npm run preview` — локальный предпросмотр `dist/`.
- `npm run lint` — ESLint.

## Переменные окружения

| Переменная           | Описание                                                                                  |
|----------------------|-------------------------------------------------------------------------------------------|
| `VITE_API_BASE_URL`  | Базовый URL бэкенда. На Vercel — URL Render-сервиса. Локально можно оставить пустым.      |
| `VITE_DEV_API_PROXY` | Куда Vite-прокси перенаправляет `/api` в dev-режиме (по умолчанию `http://localhost:8000`). |

## Деплой на Vercel

1. Импортируйте репозиторий на [vercel.com](https://vercel.com/) → New Project.
2. **Root Directory** = `frontend`.
3. Build command — `npm run build`, Output directory — `dist` (Vercel подставит сам, см. `vercel.json`).
4. Добавьте Environment Variable `VITE_API_BASE_URL` со значением URL вашего Render-сервиса
   (например `https://kinoclone-api.onrender.com`).

`vercel.json` уже включает rewrite всех путей на `/index.html` (SPA-режим).

## Структура

```
frontend/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig*.json
├── vercel.json
└── src/
    ├── main.tsx, App.tsx, App.css, index.css
    ├── pages/        # маршруты
    ├── components/   # переиспользуемые компоненты
    │   └── ui/       # shadcn/ui
    ├── contexts/     # AuthContext, ThemeContext, AccessibilityContext
    ├── hooks/        # use-toast, useDebounce, use-mobile
    ├── lib/          # utils, validations, genreIcons
    ├── services/     # api.ts (клиент REST API)
    ├── types/        # TypeScript-типы
    └── data/         # моки (демо-данные на случай отсутствия бэка)
```
