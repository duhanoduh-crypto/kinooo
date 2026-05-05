#!/usr/bin/env bash
# Используется Render как build command (см. render.yaml).
set -o errexit

pip install --upgrade pip
pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate --noinput
