#!/usr/bin/env bash
# build.sh — Script de build exécuté par Render au déploiement backend
set -o errexit

echo "==> Installing Python dependencies..."
pip install -r requirements.txt

echo "==> Running database migrations..."
python manage.py migrate --noinput

echo "==> Collecting static files..."
python manage.py collectstatic --noinput

echo "==> Creating admin users if they don't exist..."
python manage.py create_admin_users

echo "==> Build complete!"
