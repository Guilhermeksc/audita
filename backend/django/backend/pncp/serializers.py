# backend/django/backend/pncp/serializers.py

from rest_framework import serializers
from .models import PNCPModel, AmparoLegal

class AmparoLegalSerializer(serializers.ModelSerializer):
    class Meta:
        model = AmparoLegal
        fields = ['codigo', 'descricao', 'nome']

class PNCPModelSerializer(serializers.ModelSerializer):
    amparoLegal = serializers.SerializerMethodField()

    class Meta:
        model = PNCPModel
        fields = '__all__'
    
    def get_amparoLegal(self, obj):
        return {
            'codigo': obj.amparo_legal_codigo,
            'descricao': obj.amparo_legal_descricao,
            'nome': obj.amparo_legal_nome
        } 