from rest_framework import viewsets
from .models import DispensaEletronica
from .serializers import DispensaEletronicaSerializer

class DispensaEletronicaViewSet(viewsets.ModelViewSet):
    queryset = DispensaEletronica.objects.all()
    serializer_class = DispensaEletronicaSerializer 