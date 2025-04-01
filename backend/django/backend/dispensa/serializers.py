from rest_framework import serializers
from .models import DispensaEletronica, AmparoLegal

class AmparoLegalSerializer(serializers.ModelSerializer):
    class Meta:
        model = AmparoLegal
        fields = ['codigo', 'descricao', 'nome']

class DispensaEletronicaSerializer(serializers.ModelSerializer):
    amparo_legal = AmparoLegalSerializer(read_only=True)

    class Meta:
        model = DispensaEletronica
        fields = '__all__' 