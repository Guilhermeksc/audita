from rest_framework import viewsets
from .models import PNCPModel
from .serializers import PNCPModelSerializer

class PNCPModelViewSet(viewsets.ModelViewSet):
    queryset = PNCPModel.objects.all()
    serializer_class = PNCPModelSerializer 