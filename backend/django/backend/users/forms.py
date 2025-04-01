from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import Usuario

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = Usuario
        fields = (
            'nip', 'nome_completo', 'nome_de_guerra', 'posto',
            'especialidade', 'nome_funcao', 'divisao', 'email'
        )

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = Usuario
        fields = '__all__'
