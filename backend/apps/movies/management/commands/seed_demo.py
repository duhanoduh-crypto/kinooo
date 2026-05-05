"""Команда `python manage.py seed_demo` — заполняет БД демо-данными.

Использует жанры/фильмы/кинотеатры/сеансы из ТЗ и frontend/src/data/mockMovies.ts,
чтобы можно было сразу запустить фронт-бэк связку без ручного администрирования.
"""
from __future__ import annotations

from datetime import timedelta
from decimal import Decimal

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.cinemas.models import Cinema, Screening
from apps.movies.models import Genre, Movie

GENRES = [
    "Военный", "Семейный", "Мелодрама", "Мюзикл", "Мистика",
    "Фантастика", "Криминал", "Триллер", "Вестерн", "История",
    "Комедия", "Экшн", "Ужасы", "Драма", "Анимация",
    "Фэнтези", "Приключения",
]

MOVIES = [
    {
        "title": "Интерстеллар",
        "year": 2014,
        "duration": 169,
        "director": "Кристофер Нолан",
        "country": "США, Великобритания",
        "description": (
            "Когда засуха, пыльные бури и вымирание растений приводят человечество "
            "к продовольственному кризису, коллектив исследователей и учёных "
            "отправляется сквозь червоточину в поисках новой обитаемой планеты."
        ),
        "poster": "https://image.tmdb.org/t/p/w500/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg",
        "rating": Decimal("8.6"),
        "genres": ["Фантастика", "Драма", "Приключения"],
    },
    {
        "title": "Начало",
        "year": 2010,
        "duration": 148,
        "director": "Кристофер Нолан",
        "country": "США, Великобритания",
        "description": (
            "Кобб — талантливый вор в опасном искусстве извлечения секретов "
            "из подсознания во сне."
        ),
        "poster": "https://image.tmdb.org/t/p/w500/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg",
        "rating": Decimal("8.8"),
        "genres": ["Фантастика", "Триллер", "Приключения"],
    },
    {
        "title": "Тёмный рыцарь",
        "year": 2008,
        "duration": 152,
        "director": "Кристофер Нолан",
        "country": "США, Великобритания",
        "description": "Бэтмен поднимает ставки в войне с криминалом Готэма.",
        "poster": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        "rating": Decimal("9.0"),
        "genres": ["Экшн", "Драма", "Триллер"],
    },
    {
        "title": "Побег из Шоушенка",
        "year": 1994,
        "duration": 142,
        "director": "Фрэнк Дарабонт",
        "country": "США",
        "description": "История бухгалтера Энди Дюфрейна, обвинённого в убийстве жены.",
        "poster": "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
        "rating": Decimal("9.3"),
        "genres": ["Драма"],
    },
    {
        "title": "Форрест Гамп",
        "year": 1994,
        "duration": 142,
        "director": "Роберт Земекис",
        "country": "США",
        "description": "Жизнь Форреста Гампа — простого человека с большим сердцем.",
        "poster": "https://image.tmdb.org/t/p/w500/Cw4hIUIAmSYfK9QfaUW5igp9La.jpg",
        "rating": Decimal("8.8"),
        "genres": ["Драма", "Комедия", "Мелодрама"],
    },
    {
        "title": "Матрица",
        "year": 1999,
        "duration": 136,
        "director": "Лана Вачовски, Лилли Вачовски",
        "country": "США",
        "description": "Хакер Нео узнаёт правду об окружающей его реальности.",
        "poster": "https://image.tmdb.org/t/p/w500/aOIuZAjPaRIE6CMzbazvcHuHXDc.jpg",
        "rating": Decimal("8.7"),
        "genres": ["Фантастика", "Экшн"],
    },
]

CINEMAS = [
    {"name": "Краснодар Сити Молл", "address": "ул. Уральская, 79/1"},
    {"name": "OZ Молл", "address": "ул. Крылатская, 2"},
    {"name": "Красная Площадь", "address": "ул. Дзержинского, 100"},
    {"name": "Пять Звёзд", "address": "ул. Тургенева, 140"},
    {"name": "Аврора", "address": "ул. Красная, 169"},
]


class Command(BaseCommand):
    help = "Заполнить БД демо-данными (жанры, фильмы, кинотеатры, сеансы)."

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Перед заполнением удалить существующие демо-данные.",
        )

    def handle(self, *args, **options) -> None:  # type: ignore[override]
        if options["reset"]:
            self.stdout.write("Удаляем существующие демо-данные…")
            Screening.objects.all().delete()
            Cinema.objects.all().delete()
            Movie.objects.all().delete()
            Genre.objects.all().delete()

        genre_objs = {
            name: Genre.objects.get_or_create(name=name)[0] for name in GENRES
        }
        self.stdout.write(self.style.SUCCESS(f"Жанры: {len(genre_objs)}"))

        movie_objs: list[Movie] = []
        for data in MOVIES:
            genres = data.pop("genres")
            movie, _ = Movie.objects.update_or_create(
                title=data["title"], defaults=data,
            )
            movie.genres.set([genre_objs[g] for g in genres if g in genre_objs])
            movie_objs.append(movie)
            data["genres"] = genres  # вернуть, чтобы повторный запуск не сломался
        self.stdout.write(self.style.SUCCESS(f"Фильмы: {len(movie_objs)}"))

        cinema_objs: list[Cinema] = []
        for data in CINEMAS:
            cinema, _ = Cinema.objects.update_or_create(
                name=data["name"], defaults=data,
            )
            cinema_objs.append(cinema)
        self.stdout.write(self.style.SUCCESS(f"Кинотеатры: {len(cinema_objs)}"))

        Screening.objects.all().delete()
        now = timezone.now().replace(minute=0, second=0, microsecond=0)
        prices = [Decimal("250"), Decimal("300"), Decimal("350"), Decimal("400")]
        screenings_created = 0
        for day_offset in range(0, 3):
            day = now + timedelta(days=day_offset)
            for hour, price in zip([12, 15, 18, 21], prices):
                start = day.replace(hour=hour)
                for cinema in cinema_objs:
                    movie = movie_objs[(cinema.id + day_offset + hour) % len(movie_objs)]
                    Screening.objects.create(
                        cinema=cinema, movie=movie, datetime=start, price=price,
                    )
                    screenings_created += 1
        self.stdout.write(self.style.SUCCESS(f"Сеансы: {screenings_created}"))

        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser(
                username="admin",
                email="admin@kinoclone.ru",
                password="admin123",
            )
            self.stdout.write(
                self.style.SUCCESS("Создан суперпользователь admin / admin123")
            )

        self.stdout.write(self.style.SUCCESS("Готово."))
