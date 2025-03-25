# backend/diario/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('por-mes/<int:ano>/<int:mes>/', views.diarios_por_mes),
    path('meses-disponiveis/', views.meses_disponiveis),
]
