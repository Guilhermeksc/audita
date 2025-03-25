from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Perfil

@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome')
    search_fields = ('nome',)
    
@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    model = Usuario
    ordering = ['nip']
    list_display = (
        'nip',
        'nome_completo',
        'nome_de_guerra',
        'posto',
        'especialidade',
        'nome_funcao',
        'divisao',
        'email',
        'get_perfis',
        'is_staff',
    )
    search_fields = ('nip', 'nome_completo', 'nome_de_guerra', 'email')
    filter_horizontal = ('perfis',)  # interface amigável para ManyToMany

    def get_perfis(self, obj):
        return ", ".join(p.nome for p in obj.perfis.all())
    get_perfis.short_description = 'Perfis'

    def get_fieldsets(self, request, obj=None):
        base_fieldsets = (
            (None, {'fields': ('nip', 'password')}),
            ('Informações pessoais', {
                'fields': (
                    'nome_completo',
                    'nome_de_guerra',
                    'posto',
                    'especialidade',
                    'nome_funcao',
                    'divisao',
                    'email',
                )
            }),
            ('Permissões', {
                'fields': (
                    'is_active',
                    'is_staff',
                    'is_superuser',
                    'groups',
                    'user_permissions',
                )
            }),
        )

        if request.user.is_superuser:
            # Adiciona 'perfis' em uma nova seção para superusuários
            return base_fieldsets + (('Perfis do Sistema', {'fields': ('perfis',)}),)
        return base_fieldsets


    def get_readonly_fields(self, request, obj=None):
        if not request.user.is_superuser:
            return self.readonly_fields + ('is_staff', 'is_superuser')
        return super().get_readonly_fields(request, obj)
