# backend/diario/serializers.py
from rest_framework import serializers
from .models import DiarioOficial

class DiarioOficialSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiarioOficial
        fields = '__all__'
