# backend/users/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, LoginView, UserProfileView,
    ChangePasswordView, UsuarioView, TrocarPerfilView,
    AirflowDAGViewSet
)

router = DefaultRouter()
router.register(r'airflow/dags', AirflowDAGViewSet, basename='airflow-dag')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('usuario/', UsuarioView.as_view(), name='usuario_info'),
    path('trocar-perfil/', TrocarPerfilView.as_view(), name='trocar_perfil'),
    path('', include(router.urls)),
]
