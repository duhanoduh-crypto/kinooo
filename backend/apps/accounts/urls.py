from django.urls import path

from . import views

urlpatterns = [
    path("register/", views.register, name="auth-register"),
    path("login/", views.login, name="auth-login"),
    path("admin-login/", views.admin_login, name="auth-admin-login"),
    path("logout/", views.logout, name="auth-logout"),
    path("profile/", views.profile, name="auth-profile"),
]
