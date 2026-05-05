"""Главный urls.py проекта Kinoclone."""
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def healthcheck(_request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", healthcheck, name="healthcheck"),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/", include("apps.movies.urls")),
    path("api/", include("apps.cinemas.urls")),
]
