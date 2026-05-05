from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"movies", views.MovieViewSet, basename="movie")
router.register(r"genres", views.GenreViewSet, basename="genre")
router.register(r"user-movies", views.UserMovieViewSet, basename="user-movie")

urlpatterns = [
    *router.urls,
]

from django.urls import path  # noqa: E402  (после router для читаемости)

urlpatterns += [
    path("recommendations/", views.recommendations, name="recommendations"),
]
