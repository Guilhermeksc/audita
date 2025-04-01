from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Perfil
from .forms import CustomUserCreationForm, CustomUserChangeForm

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    model = Usuario
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    ordering = ['nip']
    list_display = (
        'nip', 'nome_completo', 'nome_de_guerra', 'posto',
        'especialidade', 'nome_funcao', 'divisao', 'email',
        'get_perfis', 'is_staff',
    )
    search_fields = ('nip', 'nome_completo', 'nome_de_guerra', 'email')
    filter_horizontal = ('perfis',)

    def get_form(self, request, obj=None, **kwargs):
        if obj is None:
            return CustomUserCreationForm
        return super().get_form(request, obj, **kwargs)

    def get_fieldsets(self, request, obj=None):
        if not obj:
            return (
                (None, {
                    'classes': ('wide',),
                    'fields': (
                        'nip', 'password1', 'password2',
                        'nome_completo', 'nome_de_guerra', 'posto',
                        'especialidade', 'nome_funcao', 'divisao', 'email',
                    ),
                }),
            )
        # fieldsets para edição
        base_fieldsets = (
            (None, {'fields': ('nip', 'password')}),
            ('Informações pessoais', {
                'fields': (
                    'nome_completo', 'nome_de_guerra', 'posto',
                    'especialidade', 'nome_funcao', 'divisao', 'email',
                )
            }),
            ('Permissões', {
                'fields': (
                    'is_active', 'is_staff', 'is_superuser',
                    'groups', 'user_permissions',
                )
            }),
        )
        if obj:
            base_fieldsets[1][1]['fields'] += ('perfil_ativo',)
        if request.user.is_superuser:
            return base_fieldsets + (('Perfis do Sistema', {'fields': ('perfis',)}),)
        return base_fieldsets

    def get_perfis(self, obj):
        return ", ".join(p.nome for p in obj.perfis.all())
    get_perfis.short_description = 'Perfis'

    def get_readonly_fields(self, request, obj=None):
        if obj is None:
            return ['perfil_ativo']
        return super().get_readonly_fields(request, obj)
