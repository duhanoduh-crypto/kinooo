from __future__ import annotations

from rest_framework import serializers

from .models import Cinema, Screening


class CinemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cinema
        fields = ("id", "name", "address")


class ScreeningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Screening
        fields = ("id", "cinema", "movie", "datetime", "price")
