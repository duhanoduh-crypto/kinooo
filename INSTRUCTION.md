# INSTRUCTION.md — деплой Kinoclone на Render (бэк) + Vercel (фронт)

Это пошаговая инструкция от «у меня есть только этот репозиторий» до «у меня в браузере открывается рабочее приложение». Делаешь сверху вниз, ничего не пропускаешь. Жирным выделено то, что **обязательно** надо нажать или ввести.

---

## 0. Что у нас уже сделано в репозитории

Я заранее подготовил всё, что нужно для деплоя:

- `frontend/` — Vite + React, есть `frontend/vercel.json` (Vercel сразу его подхватит), переменная окружения `VITE_API_BASE_URL` уже используется в коде, так что фронт будет ходить на любой URL бэка, который ты ему дашь.
- `backend/` — Django + DRF, есть `backend/build.sh` (он на Render автоматически делает `pip install`, `collectstatic` и `migrate`), есть `backend/Procfile` (gunicorn), есть management-команда `python manage.py seed_demo` (заполняет БД тестовыми фильмами/кинотеатрами/сеансами и создаёт админа `admin@kinoclone.ru / admin123`).
- В корне `render.yaml` — это **Blueprint для Render**, он одной кнопкой создаст PostgreSQL и веб-сервис.

То есть тебе руками нужно только нажать «Deploy» в двух местах и вписать пару переменных окружения. Поехали.

---

## 1. Подготовка GitHub-репозитория

1. Зайди на https://github.com/duhanoduh-crypto/kinooo/pull/1.
2. Нажми зелёную кнопку **`Squash and merge`** (или просто «Merge pull request», если хочешь сохранить историю коммитов). Подтверди.
3. Удалять ветку `devin/...` не обязательно, но можно нажать **`Delete branch`** — это кнопка появится после мерджа.
4. Перейди в **`main`** ветку (`Code` → дропдаун с веткой `main`) и убедись, что там видны папки `frontend/`, `backend/` и файлы `render.yaml`, `INSTRUCTION.md` (это файл, который ты сейчас читаешь), `README.md`. Если видишь — значит мердж прошёл нормально.

> Если не уверен, что мерджить безопасно: сначала сделай локально `git clone https://github.com/duhanoduh-crypto/kinooo.git`, переключись на ветку PR (`git checkout devin/1777988310-restore-structure`), убедись что всё работает (см. локальный запуск ниже в разделе 6), и только потом мерджи.

---

## 2. Деплой бэкенда на Render

### 2.1. Создать аккаунт и подключить GitHub

1. Зайди на https://render.com и нажми **`Get Started`** в правом верхнем углу.
2. Нажми **`GitHub`** (рекомендую регистрироваться через GitHub, чтобы потом не подключать руками).
3. Авторизуй приложение `Render` в GitHub: будет окно «Authorize Render», там нажми **`Authorize render-com`**.
4. После этого GitHub предложит выбрать, к каким репозиториям дать доступ. Выбери **`Only select repositories`** → начни вводить `kinooo` → выбери **`duhanoduh-crypto/kinooo`** → нажми **`Install`** (или `Save`).

Теперь Render видит твой репозиторий.

### 2.2. Развернуть Blueprint (PostgreSQL + Web Service одной кнопкой)

1. На дашборде Render (https://dashboard.render.com) нажми синюю кнопку **`+ New`** в правом верхнем углу.
2. Выбери в выпадающем списке **`Blueprint`**. (Не «Web Service»! Именно «Blueprint» — это позволит Render прочитать `render.yaml` из репо и создать сразу два ресурса: базу данных и веб-сервис.)
3. Откроется страница «Create a new Blueprint». Если репозиторий не показывается в списке — нажми **`Connect a repository`** и выбери `duhanoduh-crypto/kinooo` ещё раз.
4. Найди свой репозиторий **`duhanoduh-crypto/kinooo`**, нажми кнопку **`Connect`** напротив него.
5. На следующем экране Render покажет:
   - **Blueprint name**: можно оставить `kinooo` или ввести что-то своё, например `kinoclone`. Это имя группы ресурсов в Render, не критично.
   - **Branch**: обязательно **`main`**.
   - Render прочитает `render.yaml` и покажет, что будет создано:
     - 1 PostgreSQL **`kinoclone-db`** (free plan)
     - 1 Web Service **`kinoclone-api`** (free plan, runtime Python 3.12.5)
6. Внизу страницы будет блок **«Environment Variables»** — там Render попросит заполнить переменные, у которых в `render.yaml` стоит `sync: false`. Это:
   - **`DJANGO_CORS_ALLOWED_ORIGINS`** — пока пропусти, оставь пустым (мы вернёмся к нему в шаге 4 после деплоя Vercel).
   - **`DJANGO_CSRF_TRUSTED_ORIGINS`** — тоже пропусти.
   
   Render не даст сохранить пустыми, поэтому пока временно вбей в обе переменные **`http://localhost:5173`** — это безвредная заглушка, в шаге 4 заменим на реальный Vercel-домен.
7. Нажми внизу страницы синюю кнопку **`Apply`** (или `Create Blueprint Instance` — название кнопки иногда отличается).
8. Ты попадёшь на страницу со списком ресурсов. У сервиса `kinoclone-api` сначала будет статус **`Creating…`**, потом **`Building`**, потом **`Deploying`**, и в конце — **`Live`** (зелёный кружок). Это занимает 3–6 минут на free-плане. Можно следить в реальном времени, нажав на сервис → вкладка **`Logs`**.

### 2.3. Скопировать публичный URL бэкенда

1. Когда сервис стал `Live`, нажми на **`kinoclone-api`** в списке.
2. Сверху страницы будет URL вида `https://kinoclone-api-XXXX.onrender.com` (X — случайные символы). Скопируй его целиком.
3. Открой в браузере **`https://kinoclone-api-XXXX.onrender.com/api/health/`**. Должно открыться `{"status": "ok"}`. Если открылось — бэк жив. Если ошибка — иди в **`Logs`** и смотри traceback.

> **Важно**: на free-плане Render сервис «засыпает» после 15 минут простоя. Первое обращение после сна занимает 30–60 секунд. Это нормально.

### 2.4. Заполнить базу демо-данными

В Render у бесплатного плана **нет встроенного Shell** для запуска одноразовых команд (это есть на платных планах). Поэтому есть три варианта:

#### Вариант A (самый простой, рекомендую): один раз добавить seed в build.sh

1. Локально в терминале:
   ```bash
   git clone https://github.com/duhanoduh-crypto/kinooo.git
   cd kinooo
   ```
2. Открой `backend/build.sh` и в самом конце добавь одну строку:
   ```bash
   python manage.py seed_demo || true
   ```
   (`|| true` — чтобы build не падал, если seed уже был запущен раньше; `seed_demo` использует `get_or_create`, повторный запуск ничего не сломает).
3. Закоммить и запушь:
   ```bash
   git add backend/build.sh
   git commit -m "Seed demo data on every Render build"
   git push origin main
   ```
4. Render увидит push в `main` и автоматически передеплоит. Подожди 3–5 минут, проверь `https://kinoclone-api-XXXX.onrender.com/api/movies/` — должны быть фильмы.

#### Вариант B: вручную через psql

1. На странице базы **`kinoclone-db`** в Render найди **`External Database URL`** или **`PSQL Command`** (зависит от версии интерфейса).
2. Скопируй команду вида `PGPASSWORD=... psql -h ... -U kinoclone kinoclone` и выполни её локально.
3. Это даст psql-консоль, но `seed_demo` — это Django-команда, через psql её не запустишь. Поэтому **рекомендую вариант A**.

#### Вариант C: запросить у Render Shell-доступ (если у тебя платный план)

1. На странице сервиса `kinoclone-api` справа в боковом меню должна быть вкладка **`Shell`**.
2. Открой её, в открывшемся терминале выполни:
   ```bash
   python manage.py seed_demo
   ```
3. Должны быть строки `Жанры: 17`, `Фильмы: 6`, `Кинотеатры: 5`, `Сеансы: 60`, `Готово.`

После любого варианта проверь:
- `https://kinoclone-api-XXXX.onrender.com/api/movies/` → JSON с 6 фильмами.
- `https://kinoclone-api-XXXX.onrender.com/api/cinemas/` → JSON с 5 кинотеатрами.

### 2.5. (Опционально) проверить логин

```bash
curl -X POST https://kinoclone-api-XXXX.onrender.com/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kinoclone.ru","password":"admin123"}'
```
Должен вернуть JSON с `token` и `user.role: "admin"`.

---

## 3. Деплой фронтенда на Vercel

### 3.1. Создать аккаунт

1. Зайди на https://vercel.com/signup и зарегистрируйся через **`Continue with GitHub`**.
2. Авторизуй Vercel в GitHub. На этапе выбора репозиториев — снова выбери **`Only select repositories`** → **`duhanoduh-crypto/kinooo`**.

### 3.2. Создать проект из репозитория

1. На дашборде Vercel (https://vercel.com/dashboard) нажми **`Add New...`** в правом верхнем углу → **`Project`**.
2. В списке репозиториев найди **`duhanoduh-crypto/kinooo`** и нажми **`Import`** напротив него.
3. **Это самый важный шаг.** На странице «Configure Project»:
   - **Project Name**: можно оставить `kinooo` или поменять на `kinoclone`. На итоговый URL влияет (`https://<project-name>.vercel.app`).
   - **Framework Preset**: автоматически определится как `Vite` (если нет — выбери `Vite` в дропдауне).
   - **Root Directory**: ⚠️ **обязательно поменяй**. Нажми **`Edit`** справа от поля и выбери **`frontend`**. Это критично: без этого Vercel будет пытаться собрать корень, где нет `package.json`, и упадёт.
   - **Build and Output Settings**: ничего не трогай, всё уже задано в `frontend/vercel.json`.
4. Раскрой блок **`Environment Variables`**. Добавь одну переменную:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: твой URL Render-сервиса из шага 2.3, например `https://kinoclone-api-XXXX.onrender.com` (без слэша в конце!).
   - **Environment**: оставь все три галочки (Production, Preview, Development).
   - Нажми **`Add`**.
5. Нажми внизу синюю кнопку **`Deploy`**.
6. Vercel начнёт сборку (видно прогресс в реальном времени). Это занимает 1–3 минуты. В конце появится конфетти и URL вида **`https://kinooo-XXXX.vercel.app`**. Скопируй его.

### 3.3. Открыть приложение

1. Перейди на скопированный URL `https://kinooo-XXXX.vercel.app`.
2. Должна открыться главная Kinoclone с постерами фильмов.
3. **Сразу попробуй залогиниться**: нажми иконку профиля в правом верхнем углу → **`/auth`** → введи `admin@kinoclone.ru` / `admin123` → **`Войти`**.
4. **Скорее всего, в первый раз логин упадёт с ошибкой CORS** — это ожидаемо, мы ещё не разрешили твой Vercel-домен в настройках Render. Идём в шаг 4.

---

## 4. Связать Vercel с Render: разрешить CORS / CSRF

### 4.1. Прописать Vercel-домен в Render env-vars

1. Открой https://dashboard.render.com → **`kinoclone-api`** → в левом меню **`Environment`**.
2. Найди две переменные, в которые мы в шаге 2.2 вписали `http://localhost:5173`:
   - **`DJANGO_CORS_ALLOWED_ORIGINS`** — нажми **Edit** справа, замени значение на свой Vercel-домен, например **`https://kinooo-XXXX.vercel.app`** (без слэша в конце, через https://).
   - **`DJANGO_CSRF_TRUSTED_ORIGINS`** — то же самое: **`https://kinooo-XXXX.vercel.app`**.
3. Если у тебя несколько Vercel-окружений (production + preview-домены), перечисли их через запятую без пробелов:
   ```
   https://kinooo-XXXX.vercel.app,https://kinooo-XXXX-git-main-username.vercel.app
   ```
4. Нажми **`Save Changes`**. Render автоматически перезапустит сервис (~1 минута).

> **Когда можно не трогать**: в `backend/kinoclone/settings.py` уже есть regex `^https://.*\.vercel\.app$` через переменную `DJANGO_CORS_ALLOWED_ORIGIN_REGEXES`, который пропускает любые `*.vercel.app`-домены. Поэтому даже без шага 4.1 **CORS должен работать для production-домена**. Но для CSRF (например, форма логина) лучше явно перечислить домены — иначе при `csrftoken` могут быть отказы.

### 4.2. Проверить ещё раз

1. Открой `https://kinooo-XXXX.vercel.app/auth`.
2. Открой DevTools → вкладка **Network** (фильтр `auth`).
3. Введи `admin@kinoclone.ru` / `admin123` → **`Войти`**.
4. В Network должен появиться запрос **`POST https://kinoclone-api-XXXX.onrender.com/api/auth/login/`** со статусом **200 OK**, в ответе — `token` и `user.role: "admin"`.
5. На странице появится тост **«Вход выполнен»** и тебя редиректнет на `/`.

Если это получилось — деплой полностью рабочий. 🎉

---

## 5. Что делать, если что-то сломалось

### 5.1. На фронте белый экран

- Открой DevTools → **Console**. Если видишь `Failed to fetch` или `CORS error` — иди в шаг 4.
- Если видишь `Cannot find module` или 404 на ассеты — значит Vercel собрал не тот каталог. Проверь, что в Vercel → Project Settings → **Build & Development Settings** → **Root Directory** = `frontend`.

### 5.2. `/api/...` отвечает 502 / 503 / Application Error

- На free-плане Render первое обращение после сна занимает до 60 секунд. Подожди и обнови.
- В Render → `kinoclone-api` → **Logs** посмотри traceback. Чаще всего: забыл прогнать `seed_demo`, либо в env-vars пустой `DJANGO_SECRET_KEY` (но Render должен его сгенерировать сам по `generateValue: true` в `render.yaml`).

### 5.3. Логин 401 / 403, хотя пароль правильный

- Это значит, БД пустая, юзера `admin@kinoclone.ru` не существует. Прогнать `seed_demo` (см. шаг 2.4).

### 5.4. Запрос идёт на `localhost:5173/api/...` вместо Render

- Vercel не подхватил `VITE_API_BASE_URL`. Проверь:
  - В Vercel → Project → Settings → **Environment Variables** — есть ли `VITE_API_BASE_URL`, и стоит ли он галочкой на **Production**?
  - После добавления переменной нужно **redeploy** (Vercel → Deployments → последний деплой → **`...`** → **Redeploy**).

### 5.5. CORS-ошибка в Network даже после шага 4

- В Render → Environment проверь, что **`DJANGO_CORS_ALLOWED_ORIGINS`** содержит **точный** Vercel-домен **со схемой `https://`**, **без слэша на конце**.
- После изменения переменной обязательно дождись «Deploy live» в Render (1–2 минуты).
- В DevTools нажми правой кнопкой на запрос → **Copy as cURL** → проверь, какой `Origin` шлёт фронт — он должен **точно совпадать** с одним из значений в `DJANGO_CORS_ALLOWED_ORIGINS` или матчиться regex `^https://.*\.vercel\.app$`.

---

## 6. (Бонус) Локальный запуск, чтобы быстро отлаживать

Если что-то ломается на проде и хочется быстро проверить — можно поднять всю связку локально:

### 6.1. Бэкенд (Django)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate         # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # отредактируй DJANGO_SECRET_KEY если нужно
python manage.py migrate
python manage.py seed_demo
python manage.py runserver 0.0.0.0:8000
```

### 6.2. Фронтенд (Vite, в другом терминале)

```bash
cd frontend
cp .env.example .env              # VITE_API_BASE_URL можно оставить пустым
                                   # тогда фронт пойдёт на /api → http://localhost:8000 через Vite proxy
npm install
npm run dev
```

Открой http://localhost:5173 → `/auth` → `admin@kinoclone.ru` / `admin123` → должен залогиниться.

> Если на странице `/admin` (Django admin) видишь **500 Server Error** — это потому что `DJANGO_DEBUG=False` плюс whitenoise хочет `collectstatic`. Поправь либо `DJANGO_DEBUG=true` в `backend/.env`, либо запусти `python manage.py collectstatic --no-input`.

---

## 7. Итоговый чек-лист

- [ ] PR #1 смерджен в `main`.
- [ ] На Render развёрнут Blueprint, БД и сервис в статусе **Live**.
- [ ] `https://kinoclone-api-XXXX.onrender.com/api/health/` → `{"status":"ok"}`.
- [ ] `https://kinoclone-api-XXXX.onrender.com/api/movies/` → JSON с 6 фильмами.
- [ ] На Vercel создан проект с **Root Directory = `frontend`** и **`VITE_API_BASE_URL`** = URL Render.
- [ ] `https://kinooo-XXXX.vercel.app` открывается с постерами фильмов.
- [ ] В Render env-vars **`DJANGO_CORS_ALLOWED_ORIGINS`** и **`DJANGO_CSRF_TRUSTED_ORIGINS`** = Vercel-домен.
- [ ] Логин `admin@kinoclone.ru / admin123` через UI работает (статус 200, токен сохранён в localStorage).

---

## 8. Стоимость и лимиты (чтобы знать, на что подписался)

| Сервис | План | Цена | Лимиты |
|--------|------|------|--------|
| Render PostgreSQL | Free | $0 | 1 GB storage, **удаляется через 30 дней без апгрейда** |
| Render Web Service | Free | $0 | 512 MB RAM, **«засыпает» через 15 мин простоя** |
| Vercel Hobby | Free | $0 | 100 GB трафика/мес, неограниченное число деплоев |

> **⚠️ Важно про Render free DB**: если БД на free-плане старше 30 дней, Render её удалит. Чтобы не потерять данные — апгрейдь до $7/мес или регулярно дампи через `pg_dump`.

Если захочешь продакшен — апгрейдь Render Web Service до **Starter ($7/мес)** (без сна) и БД до **Starter ($7/мес)** (без удаления). Vercel Hobby для пет-проекта более чем достаточно.
