from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PNCPModelViewSet

router = DefaultRouter()
router.register(r'dispensa-eletronica', PNCPModelViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 