# backend/users/apps.py

from django.apps import AppConfig

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend.users'  # ⚠️ Caminho completo

    def ready(self):
        import backend.users.signals  # ✅ Corrigido
