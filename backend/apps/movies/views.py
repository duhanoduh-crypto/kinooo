from __future__ import annotations

from collections import Counter

from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from .models import Genre, Movie, UserMovie
from .serializers import GenreSerializer, MovieSerializer, UserMovieSerializer


class IsAdminOrReadOnly(IsAdminUser):
    """GET доступен всем, мутации — только staff/superuser."""

    def has_permission(self, request: Request, view) -> bool:  # type: ignore[override]
        if request.method in {"GET", "HEAD", "OPTIONS"}:
            return True
        return bool(request.user and (request.user.is_staff or request.user.is_superuser))


class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.prefetch_related("genres").all()
    serializer_class = MovieSerializer
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ("title", "director")
    ordering_fields = ("rating", "year", "title")
    filterset_fields = {
        "year": ["exact", "gte", "lte"],
        "rating": ["gte", "lte"],
        "country": ["exact", "icontains"],
        "genres": ["exact"],
    }


class GenreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [AllowAny]


class UserMovieViewSet(viewsets.ModelViewSet):
    serializer_class = UserMovieSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            UserMovie.objects.filter(user=self.request.user)
            .select_related("movie")
            .prefetch_related("movie__genres")
        )

    def create(self, request: Request, *args, **kwargs) -> Response:
        # Upsert по паре (user, movie): если запись уже есть — обновляем.
        movie_id = request.data.get("movie")
        instance = (
            UserMovie.objects.filter(user=request.user, movie_id=movie_id).first()
            if movie_id is not None
            else None
        )
        serializer = self.get_serializer(instance, data=request.data, partial=instance is not None)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        response_status = status.HTTP_200_OK if instance is not None else status.HTTP_201_CREATED
        return Response(serializer.data, status=response_status)

    def perform_create(self, serializer) -> None:  # pragma: no cover - см. create()
        serializer.save(user=self.request.user)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recommendations(request: Request) -> Response:
    """Подбор рекомендаций по топ-жанрам высоко оценённых фильмов пользователя."""
    high_rated = (
        UserMovie.objects.filter(user=request.user, rating__gte=8)
        .select_related("movie")
        .prefetch_related("movie__genres")
    )
    if high_rated.count() < 3:
        return Response(
            {
                "ready": False,
                "progress": high_rated.count(),
                "required": 3,
                "movies": [],
            }
        )

    genre_counter: Counter[int] = Counter()
    seen_movie_ids: set[int] = set()
    for um in high_rated:
        seen_movie_ids.add(um.movie_id)
        for genre in um.movie.genres.all():
            genre_counter[genre.id] += 1

    user_movie_ids = set(
        UserMovie.objects.filter(user=request.user).values_list("movie_id", flat=True)
    )

    top_genre_ids = [genre_id for genre_id, _ in genre_counter.most_common(5)]
    if not top_genre_ids:
        return Response({"ready": True, "progress": high_rated.count(), "required": 3, "movies": []})

    queryset = (
        Movie.objects.prefetch_related("genres")
        .filter(genres__id__in=top_genre_ids)
        .exclude(id__in=user_movie_ids)
        .distinct()
        .order_by("-rating")[:20]
    )

    return Response(
        {
            "ready": True,
            "progress": high_rated.count(),
            "required": 3,
            "movies": MovieSerializer(queryset, many=True).data,
        }
    )
