from django import forms
from .models import Usuario

class UsuarioAdminCreateForm(forms.ModelForm):
    class Meta:
        model = Usuario
        fields = ['nip', 'nome_completo', 'posto', 'nome_funcao', 'divisao', 'email']

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = Usuario
        fields = '__all__'