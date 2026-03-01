
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import HttpResponse
from django.urls import include, path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="KleerInfini API",
        default_version='v1',
        description="Documentation interactive de l’API KleerInfini (auth, abonnements, notifications, etc.)",
        contact=openapi.Contact(email="support@kleerinfini.com"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

def adminpanel_info(request):
    return HttpResponse('''
        <html>
        <head>
            <title>KleerInfini AdminPanel</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body { background: #f7f8fa; font-family: 'Segoe UI', Arial, sans-serif; color: #23272f; margin: 0; }
                .header {
                    background: linear-gradient(90deg, #23395d 0%, #406e8e 100%);
                    color: #fff;
                    padding: 36px 0 20px 0;
                    text-align: center;
                    border-radius: 0 0 24px 24px;
                    box-shadow: 0 4px 24px #23395d22;
                }
                .header h1 { margin: 0; font-size: 2.6rem; letter-spacing: 1px; font-weight: 700; }
                .header p { margin: 14px 0 0 0; font-size: 1.18em; font-weight: 400; }
                .container {
                    max-width: 760px;
                    margin: 36px auto 0 auto;
                    background: #fff;
                    border-radius: 18px;
                    box-shadow: 0 4px 24px #0001;
                    padding: 38px 48px 32px 48px;
                    border: 1px solid #e5e7eb;
                }
                @media (max-width: 900px) { .container { padding: 18px 4vw; } }
                h2 { color: #23395d; font-size: 1.35rem; margin-top: 2em; font-weight: 600; }
                ul { padding-left: 1.3em; margin: 0.5em 0 1.2em 0; }
                li { margin-bottom: 0.6em; font-size: 1.08em; line-height: 1.5; }
                b { color: #23395d; }
                a { color: #23395d; text-decoration: none; font-weight: 600; }
                a.button {
                    background: #23395d;
                    color: #fff;
                    border-radius: 6px;
                    padding: 8px 18px;
                    margin: 0 4px;
                    display: inline-block;
                    box-shadow: 0 2px 8px #23395d22;
                    transition: background 0.2s;
                    font-size: 1.08em;
                }
                a.button:hover { background: #1a2536; }
                a:hover { text-decoration: underline; }
                .note {
                    background: #e6ecf5;
                    color: #23395d;
                    border-radius: 8px;
                    padding: 16px 22px;
                    margin: 32px 0 0 0;
                    font-size: 1.04em;
                    box-shadow: 0 2px 8px #23395d11;
                    border-left: 4px solid #406e8e;
                }
                .footer {
                    margin-top: 38px;
                    color: #888;
                    font-size: 0.97em;
                    text-align: right;
                }
                .step {
                    margin-bottom: 2.1em;
                    padding-bottom: 1.1em;
                    border-bottom: 1px solid #e5e7eb;
                }
                .step:last-child { border-bottom: none; }
                .step-title {
                    font-weight: 600;
                    color: #23395d;
                    font-size: 1.13em;
                    margin-bottom: 0.3em;
                    display: block;
                }
                .tip {
                    background: #fef9c3;
                    color: #b45309;
                    border-radius: 6px;
                    padding: 8px 14px;
                    margin: 10px 0 0 0;
                    font-size: 0.98em;
                    display: inline-block;
                }
                .dev-section {
                    background: #f3f4f6;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    margin: 32px 0 0 0;
                    padding: 18px 22px;
                    font-size: 1.04em;
                }
                .dev-section h2 {
                    color: #406e8e;
                    font-size: 1.18em;
                    margin-top: 0;
                }
                @media (max-width: 600px) {
                    .header h1 { font-size: 1.5rem; }
                    .container { padding: 10px 2vw; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>KleerInfini AdminPanel</h1>
                <p>Bienvenue sur la plateforme d’administration <b>KleerInfini</b>.<br>
                <span style="color:#fef9c3;font-weight:bold;">Ce guide est conçu pour les administrateurs débutants ou non formés.</span></p>
            </div>
            <div class="container">
                <div class="step">
                    <span class="step-title">1. Connexion à l’interface d’administration</span>
                    Cliquez ici&nbsp;: <a href="/admin/" class="button">Accéder à l’admin</a><br>
                    Entrez votre identifiant (email) et mot de passe fournis par l’équipe technique.<br>
                    <span class="tip">Si vous n’avez pas de compte, contactez le support technique.</span>
                </div>
                <div class="step">
                    <span class="step-title">2. Gérer les utilisateurs</span>
                    <ul>
                        <li><b>Producteurs</b> : inscrivez de nouveaux producteurs via le bouton “Ajouter” dans la section Producteurs.</li>
                        <li><b>Clients</b> : invitez un client via le menu “Invitations”, puis transmettez-lui le lien généré.</li>
                        <li><b>Rôles</b> : chaque utilisateur a un rôle (admin, producteur, client) qui détermine ses droits.</li>
                    </ul>
                </div>
                <div class="step">
                    <span class="step-title">3. Gérer les abonnements producteurs</span>
                    <ul>
                        <li>Vérifiez les statuts d’abonnement (actif, en attente, expiré).</li>
                        <li>Validez les preuves de paiement reçues.</li>
                        <li>Relancez les producteurs si besoin (relances automatiques gérées par le système).</li>
                    </ul>
                </div>
                <div class="step">
                    <span class="step-title">4. Notifications et alertes</span>
                    <ul>
                        <li>Consultez les notifications générées automatiquement (relances, alertes, etc.).</li>
                        <li>Marquez-les comme lues pour un meilleur suivi.</li>
                    </ul>
                </div>
                <div class="step">
                    <span class="step-title">5. Conseils pratiques</span>
                    <ul>
                        <li>Utilisez la barre de recherche en haut pour trouver rapidement un utilisateur ou un abonnement.</li>
                        <li>En cas de doute, survolez les icônes ou cliquez sur “?” pour obtenir de l’aide contextuelle.</li>
                        <li>Consultez régulièrement le <b>README</b> du projet pour les nouveautés et la documentation technique.</li>
                        <li>Pour toute question, contactez l’équipe technique ou le support.</li>
                    </ul>
                </div>
                <div class="dev-section">
                    <h2>Pour les développeurs : Documentation Swagger</h2>
                    <p>
                        Toute l’API backend est documentée et testable en ligne via Swagger UI.<br>
                        <b>Accès rapide :</b> <a href="/swagger/" target="_blank">/swagger/</a><br>
                        <b>Version lecture seule :</b> <a href="/redoc/" target="_blank">/redoc/</a><br>
                        <ul>
                            <li>Vous pouvez explorer tous les endpoints, voir les paramètres, les réponses, et tester les requêtes directement depuis Swagger.</li>
                            <li>Pour les routes protégées, cliquez sur “Authorize” et entrez votre token JWT (Bearer) pour tester les endpoints sécurisés.</li>
                            <li>La documentation est générée automatiquement à partir du code et des serializers DRF.</li>
                        </ul>
                    </p>
                </div>
                <div class="note">
                    <b>Résumé :</b><br>
                    Cette interface admin vous permet de piloter toute la plateforme KleerInfini sans connaissance technique avancée. Suivez les étapes ci-dessus, et n’hésitez pas à demander de l’aide si besoin.
                </div>
                <div class="footer">
                    Consultez le <b>README</b> du projet pour plus de détails techniques.<br>
                    <span>&copy; 2025 KleerInfini</span>
                </div>
            </div>
        </body>
        </html>
    ''')

urlpatterns = [
    path('', adminpanel_info, name='adminpanel_info'),
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/subscriptions/', include('subscriptions.urls')),
    path('api/', include('clients.urls')),
    path('api/', include('notifications.urls')),
    path('api/', include('admin_panel.urls')),
    path('api/', include('products.urls')),
    path('api/', include('producers.urls')),
    path('api/', include('events.urls')),  # Events API
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/notifications/', include('notifications.urls')),
    path('api/export-hub/', include('export_hub.urls')),
    path('api/password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path('api/', include('user_messages.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
