from __future__ import annotations

from rest_framework import serializers

from .models import Genre, Movie, UserMovie


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ("id", "name")


class MovieSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    genre_ids = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(),
        many=True,
        write_only=True,
        required=False,
        source="genres",
    )

    class Meta:
        model = Movie
        fields = (
            "id",
            "title",
            "year",
            "duration",
            "director",
            "description",
            "poster",
            "rating",
            "country",
            "genres",
            "genre_ids",
        )


class UserMovieSerializer(serializers.ModelSerializer):
    movie_detail = MovieSerializer(source="movie", read_only=True)

    class Meta:
        model = UserMovie
        fields = (
            "id",
            "movie",
            "movie_detail",
            "status",
            "rating",
            "comment",
            "date_added",
            "date_updated",
        )
        read_only_fields = ("date_added", "date_updated")

    def validate_rating(self, value: int | None) -> int | None:
        if value is None:
            return value
        if not 1 <= value <= 10:
            raise serializers.ValidationError("Оценка должна быть от 1 до 10")
        return value
