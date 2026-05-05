"""ASGI config for kinoclone project."""
import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "kinoclone.settings")

application = get_asgi_application()
