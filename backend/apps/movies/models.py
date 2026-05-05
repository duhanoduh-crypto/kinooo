from __future__ import annotations

from django.conf import settings
from django.db import models


class Genre(models.Model):
    name = models.CharField("Название", max_length=50, unique=True)

    class Meta:
        db_table = "genres"
        ordering = ["name"]
        verbose_name = "Жанр"
        verbose_name_plural = "Жанры"

    def __str__(self) -> str:  # pragma: no cover - тривиально
        return self.name


class Movie(models.Model):
    title = models.CharField("Название", max_length=255)
    year = models.IntegerField("Год выпуска", null=True, blank=True)
    duration = models.IntegerField("Длительность, мин", null=True, blank=True)
    director = models.CharField("Режиссёр", max_length=255, blank=True, default="")
    description = models.TextField("Описание", blank=True, default="")
    poster = models.CharField("URL постера", max_length=500, blank=True, default="")
    rating = models.DecimalField(
        "Рейтинг",
        max_digits=3,
        decimal_places=1,
        null=True,
        blank=True,
    )
    country = models.CharField("Страна", max_length=255, blank=True, default="")

    genres = models.ManyToManyField(
        Genre,
        through="MovieGenre",
        related_name="movies",
        blank=True,
    )

    class Meta:
        db_table = "movies"
        ordering = ["-rating", "title"]
        verbose_name = "Фильм"
        verbose_name_plural = "Фильмы"

    def __str__(self) -> str:  # pragma: no cover - тривиально
        return self.title


class MovieGenre(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)

    class Meta:
        db_table = "movie_genres"
        unique_together = ("movie", "genre")
        verbose_name = "Жанр фильма"
        verbose_name_plural = "Жанры фильмов"


class UserMovie(models.Model):
    class Status(models.TextChoices):
        PLANNED = "planned", "Запланировано"
        WATCHING = "watching", "Смотрю"
        COMPLETED = "completed", "Просмотрено"
        DROPPED = "dropped", "Брошено"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="user_movies",
    )
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="user_movies")
    status = models.CharField("Статус", max_length=20, choices=Status.choices)
    rating = models.IntegerField("Оценка 1-10", null=True, blank=True)
    comment = models.TextField("Комментарий", blank=True, default="")
    date_added = models.DateTimeField("Дата добавления", auto_now_add=True)
    date_updated = models.DateTimeField("Дата изменения", auto_now=True)

    class Meta:
        db_table = "users_usermovies"
        unique_together = ("user", "movie")
        ordering = ["-date_updated"]
        verbose_name = "Фильм пользователя"
        verbose_name_plural = "Фильмы пользователей"
