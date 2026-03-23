# Migration de correction — supprime `password_hash` seulement si elle existe
# Ceci est sécurisée et idempotente : elle ne crache pas si la colonne n'existe pas.

from django.db import migrations, connection


def remove_password_hash_if_exists(apps, schema_editor):
    with connection.cursor() as cursor:
        # Récupère les colonnes de la table users_user
        cursor.execute("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'users_user'
              AND column_name = 'password_hash';
        """)
        row = cursor.fetchone()
        if row:
            cursor.execute('ALTER TABLE users_user DROP COLUMN password_hash;')
            print("INFO: Column 'password_hash' dropped from users_user.")
        else:
            print("INFO: Column 'password_hash' does not exist, nothing to do.")


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_user_is_2fa_enabled_user_otp_base32'),
    ]

    operations = [
        migrations.RunPython(remove_password_hash_if_exists, reverse_code=noop),
    ]
