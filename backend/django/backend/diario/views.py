# backend/diario/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import DiarioOficial
from .serializers import DiarioOficialSerializer

MONTH_MAP = {
    "01": "JAN", "02": "FEV", "03": "MAR", "04": "ABR",
    "05": "MAI", "06": "JUN", "07": "JUL", "08": "AGO",
    "09": "SET", "10": "OUT", "11": "NOV", "12": "DEZ"
}

@api_view(['GET'])
def diarios_por_mes(request, ano, mes):
    mes_str = f"{int(mes):02d}"  # Garante que seja dois dígitos
    mes_nome = MONTH_MAP.get(mes_str)
    if not mes_nome:
        return Response({"erro": "Mês inválido."}, status=400)

    diarios = DiarioOficial.objects.filter(ano=ano, mes=mes_nome)
    serializer = DiarioOficialSerializer(diarios, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def meses_disponiveis(request):
    diarios = DiarioOficial.objects.values('ano', 'mes').distinct()
    resultado = sorted([{'ano': d['ano'], 'mes': int(d['mes'])} for d in diarios], key=lambda x: (x['ano'], x['mes']))
    return Response(resultado)
