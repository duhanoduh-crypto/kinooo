from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"cinemas", views.CinemaViewSet, basename="cinema")
router.register(r"screenings", views.ScreeningViewSet, basename="screening")

urlpatterns = router.urls
