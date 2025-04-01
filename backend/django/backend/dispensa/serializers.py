from rest_framework import serializers
from .models import DispensaEletronica, AmparoLegal

class AmparoLegalSerializer(serializers.ModelSerializer):
    class Meta:
        model = AmparoLegal
        fields = ['codigo', 'descricao', 'nome']

class DispensaEletronicaSerializer(serializers.ModelSerializer):
    amparoLegal = serializers.SerializerMethodField()

    class Meta:
        model = DispensaEletronica
        fields = '__all__'
    
    def get_amparoLegal(self, obj):
        return {
            'codigo': obj.amparo_legal_codigo,
            'descricao': obj.amparo_legal_descricao,
            'nome': obj.amparo_legal_nome
        } 