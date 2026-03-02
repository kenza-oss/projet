#!/usr/bin/env bash
# build.sh — Script de build exécuté par Render au déploiement backend
set -o errexit

echo "==> Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt --no-cache-dir

echo "==> Running database migrations..."
python manage.py migrate --noinput

echo "==> Collecting static files..."
python manage.py collectstatic --noinput

echo "==> Creating admin users..."
# We use a subshell or just allow it to fail if it's already there/error
python manage.py create_admin_users || echo "Admin creation skipped or failed, check logs"

echo "==> Build complete!"
