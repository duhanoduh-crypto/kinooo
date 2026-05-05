# Kinoclone

Веб-приложение для отслеживания фильмов и расписания кинотеатров Краснодара.
Монорепозиторий: фронт (Vite + React + TypeScript) и бэк (Django + DRF + PostgreSQL).

## Структура

```
.
├── frontend/        # Vite + React, деплой на Vercel
│   ├── src/         # pages/components/contexts/hooks/lib/services/types/data
│   ├── vercel.json
│   ├── package.json
│   └── …
├── backend/         # Django + DRF, деплой на Render
│   ├── kinoclone/   # настройки проекта (settings, urls, wsgi)
│   ├── apps/
│   │   ├── accounts/  # регистрация/логин по токенам
│   │   ├── movies/    # фильмы, жанры, коллекция, рекомендации
│   │   └── cinemas/   # кинотеатры и расписание сеансов
│   ├── requirements.txt
│   ├── Procfile
│   ├── build.sh
│   └── …
└── render.yaml      # blueprint Render
```

## Возможности

- Каталог фильмов, фильтрация и сортировка
- Поиск с мгновенными результатами по названию и режиссёру
- Личная коллекция со статусами (`planned`/`watching`/`completed`/`dropped`) и оценкой 1–10
- Персональные рекомендации после 3+ оценок 8–10
- Расписание сеансов в кинотеатрах Краснодара
- Админка Django (CRUD для фильмов, жанров, кинотеатров, сеансов)
- Светлая/тёмная тема + режим для слабовидящих

## Быстрый старт

### 1. Бэкенд

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py seed_demo        # демо-данные + admin / admin123
python manage.py runserver 0.0.0.0:8000
```

### 2. Фронтенд

```bash
cd frontend
cp .env.example .env
npm install
npm run dev    # http://localhost:5173, /api проксируется на :8000
```

## Деплой

### Vercel (frontend)

1. New Project → выберите этот репозиторий.
2. **Root Directory** = `frontend`.
3. Build command и Output directory подтянутся из `frontend/vercel.json`.
4. В Environment Variables укажите:
   - `VITE_API_BASE_URL` = URL вашего Render-сервиса (например `https://kinoclone-api.onrender.com`).

### Render (backend)

1. New → Blueprint → ваш репозиторий.
2. Render считает корневой `render.yaml` и развернёт:
   - PostgreSQL `kinoclone-db`
   - Web-сервис `kinoclone-api` (gunicorn + WhiteNoise)
3. После создания сервиса задайте переменные:
   - `DJANGO_CORS_ALLOWED_ORIGINS` = `https://<ваш-vercel-домен>` (через запятую можно несколько).
   - `DJANGO_CSRF_TRUSTED_ORIGINS` — то же самое.
4. (По желанию) в Render Shell:
   ```bash
   python manage.py seed_demo
   python manage.py createsuperuser
   ```

После этого фронт на Vercel будет ходить на API на Render. Всё.

## Тестовые учётки (после `seed_demo`)

- Админ: `admin@kinoclone.ru` / `admin123`
- Любой обычный пользователь — заведите регистрацией.

## Команда разработки

- **Frontend**: Андрей Муратов
- **Backend**: Евгения Кулакова
- **Database**: Дарья Кормилицына
