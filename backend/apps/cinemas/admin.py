from django.contrib import admin

from .models import Cinema, Screening


@admin.register(Cinema)
class CinemaAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "address")
    search_fields = ("name", "address")


@admin.register(Screening)
class ScreeningAdmin(admin.ModelAdmin):
    list_display = ("id", "cinema", "movie", "datetime", "price")
    list_filter = ("cinema", "datetime")
    search_fields = ("cinema__name", "movie__title")
