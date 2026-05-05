from __future__ import annotations

from django.db import models

from apps.movies.models import Movie


class Cinema(models.Model):
    name = models.CharField("Название", max_length=100)
    address = models.CharField("Адрес", max_length=255)

    class Meta:
        db_table = "cinemas"
        ordering = ["name"]
        verbose_name = "Кинотеатр"
        verbose_name_plural = "Кинотеатры"

    def __str__(self) -> str:  # pragma: no cover - тривиально
        return self.name


class Screening(models.Model):
    cinema = models.ForeignKey(
        Cinema,
        on_delete=models.CASCADE,
        related_name="screenings",
    )
    movie = models.ForeignKey(
        Movie,
        on_delete=models.CASCADE,
        related_name="screenings",
    )
    datetime = models.DateTimeField("Дата и время сеанса")
    price = models.DecimalField("Цена билета", max_digits=8, decimal_places=2)

    class Meta:
        db_table = "screenings"
        ordering = ["datetime"]
        verbose_name = "Сеанс"
        verbose_name_plural = "Сеансы"
