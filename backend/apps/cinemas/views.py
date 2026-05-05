from __future__ import annotations

from rest_framework import viewsets

from apps.movies.views import IsAdminOrReadOnly

from .models import Cinema, Screening
from .serializers import CinemaSerializer, ScreeningSerializer


class CinemaViewSet(viewsets.ModelViewSet):
    queryset = Cinema.objects.all()
    serializer_class = CinemaSerializer
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ("name", "address")


class ScreeningViewSet(viewsets.ModelViewSet):
    queryset = Screening.objects.select_related("cinema", "movie").all()
    serializer_class = ScreeningSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = {
        "cinema": ["exact"],
        "movie": ["exact"],
        "datetime": ["gte", "lte", "date"],
    }
    ordering_fields = ("datetime", "price")
