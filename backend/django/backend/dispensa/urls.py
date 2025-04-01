from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DispensaEletronicaViewSet

router = DefaultRouter()
router.register(r'dispensa-eletronica', DispensaEletronicaViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 