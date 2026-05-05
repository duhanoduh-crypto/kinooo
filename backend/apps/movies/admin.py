from django.contrib import admin

from .models import Genre, Movie, MovieGenre, UserMovie


class MovieGenreInline(admin.TabularInline):
    model = MovieGenre
    extra = 1


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "year", "director", "rating", "country")
    list_filter = ("year", "country")
    search_fields = ("title", "director")
    inlines = (MovieGenreInline,)


@admin.register(UserMovie)
class UserMovieAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "movie", "status", "rating", "date_updated")
    list_filter = ("status",)
    search_fields = ("user__username", "movie__title")
