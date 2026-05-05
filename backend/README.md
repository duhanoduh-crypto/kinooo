# Kinoclone — Backend (Django + DRF)

REST API для проекта Kinoclone: фильмы, жанры, кинотеатры, расписание, личная
коллекция пользователя, рекомендации, авторизация по токенам.

## Требования

- Python 3.12+
- (опционально) PostgreSQL 14+ для прод/боевого окружения. По умолчанию
  поднимается SQLite в `backend/db.sqlite3`.

## Локальный запуск

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env   # подправьте по желанию

python manage.py migrate
python manage.py seed_demo          # заполнит демо-данными + создаст admin / admin123
python manage.py runserver 0.0.0.0:8000
```

API будет доступен на `http://localhost:8000/api/`, админка — `http://localhost:8000/admin/`.

## Основные эндпоинты

| Метод  | URL                                | Описание                                  |
|--------|------------------------------------|-------------------------------------------|
| POST   | `/api/auth/register/`              | Регистрация (`username`, `email`, `password`) |
| POST   | `/api/auth/login/`                 | Логин по `email` + `password`             |
| POST   | `/api/auth/admin-login/`           | Логин с проверкой `is_staff/is_superuser` |
| POST   | `/api/auth/logout/`                | Удаление токена текущего пользователя     |
| GET    | `/api/auth/profile/`               | Профиль текущего пользователя             |
| GET    | `/api/movies/`                     | Каталог фильмов (фильтры, поиск, сортировка) |
| GET    | `/api/movies/<id>/`                | Детальная информация о фильме             |
| POST/PUT/DELETE `/api/movies/...`  | CRUD (только для админа)                  |
| GET    | `/api/genres/`                     | Список жанров                             |
| GET    | `/api/cinemas/`                    | Список кинотеатров                        |
| GET    | `/api/screenings/?cinema=&date=`   | Расписание сеансов                        |
| GET/POST/DELETE `/api/user-movies/`| Личная коллекция (нужен токен)            |
| GET    | `/api/recommendations/`            | Персональные рекомендации                 |
| GET    | `/api/health/`                     | Healthcheck                               |

Авторизация: `Authorization: Token <ключ>` в HTTP-заголовке.

## Деплой на Render

Корневой `render.yaml` — это blueprint, разворачивающий PostgreSQL и веб-сервис.

1. На [render.com](https://render.com/) → New → Blueprint → выбрать этот репозиторий.
2. Render считает `render.yaml`, поднимет БД `kinoclone-db` и сервис `kinoclone-api`.
3. После первого деплоя задайте `DJANGO_CORS_ALLOWED_ORIGINS` и
   `DJANGO_CSRF_TRUSTED_ORIGINS`, добавив туда URL фронта на Vercel
   (например `https://kinoclone.vercel.app`).
4. (По желанию) откройте Shell на сервисе и выполните:
   ```bash
   python manage.py seed_demo
   python manage.py createsuperuser
   ```

`build.sh` ставит зависимости, делает `collectstatic` и `migrate`. Запуск через
`gunicorn` (см. `Procfile` и `render.yaml`).

## Переменные окружения

Смотрите `.env.example` — там описаны `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`,
`DATABASE_URL`, CORS/CSRF-настройки и т. д.
