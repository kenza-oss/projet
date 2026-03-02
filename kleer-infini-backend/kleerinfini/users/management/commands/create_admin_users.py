"""
Management command: create_admin_users
Crée les comptes administrateurs lors du déploiement sur Render.
Les mots de passe sont lus depuis les variables d'environnement.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from decouple import config


class Command(BaseCommand):
    help = 'Crée les comptes admin si ils n\'existent pas (utilisé au déploiement Render)'

    def handle(self, *args, **options):
        User = get_user_model()

        admin_accounts = [
            {
                'email': 'admin@kleerinfini.com',
                'password': config('ADMIN_PASSWORD_1', default='KleerAdmin2025!'),
                'first_name': 'Admin',
                'last_name': 'Principal',
            },
            {
                'email': 'kleernetinfini@gmail.com',
                'password': config('ADMIN_PASSWORD_2', default='|5m$-8ums_q2*ZZ1FbVD\\2mv{+uLK}%p'),
                'first_name': 'Admin',
                'last_name': 'Secours1',
            },
            {
                'email': 'kleerlogistics@gmail.com',
                'password': config('ADMIN_PASSWORD_3', default='_-9U}8RU-GyToosi;!k;vbVRcFZEg7eR'),
                'first_name': 'Admin',
                'last_name': 'Secours2',
            },
            {
                'email': 'admin2@kleerinfini.com',
                'password': config('ADMIN_PASSWORD_4', default='i#^GW,SP+47T{LQ<XY;aS)9M$Q5h%2n|'),
                'first_name': 'Admin',
                'last_name': 'Secours3',
            },
        ]

        for account in admin_accounts:
            email = account['email']
            try:
                user = User.objects.get(email=email)
                # Always update the password to ensure it matches env variable
                user.set_password(account['password'])
                user.is_staff = True
                user.is_superuser = True
                user.role = 'admin'
                user.save()
                self.stdout.write(self.style.SUCCESS(f'[OK] Mot de passe mis à jour: {email}'))
            except User.DoesNotExist:
                user = User.objects.create_user(
                    email=email,
                    password=account['password'],
                    first_name=account['first_name'],
                    last_name=account['last_name'],
                    is_staff=True,
                    is_superuser=True,
                )
                user.role = 'admin'
                user.save()
                self.stdout.write(self.style.SUCCESS(f'[CRÉÉ] Nouveau compte admin: {email}'))
