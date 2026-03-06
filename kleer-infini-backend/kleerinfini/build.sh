#!/usr/bin/env bash
# build.sh — Script de build exécuté par Render au déploiement backend
set -o errexit

echo "==> Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt --no-cache-dir

echo "==> Collecting static files..."
# We use standard StaticFilesStorage now to avoid manifest issues
python manage.py collectstatic --noinput

echo "==> Running database migrations..."
python manage.py migrate --noinput

echo "==> Creating admin users..."
python manage.py create_admin_users || echo "Admin creation skipped or failed, check logs"

echo "==> Build complete!"
