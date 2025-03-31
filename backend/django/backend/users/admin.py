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


    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if not obj.perfil_ativo and obj.perfis.exists():
            obj.perfil_ativo = obj.perfis.first()
            obj.save()
            
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

        # perfil_ativo será apenas editável após criação
        if obj:  # Ou seja, já foi salvo
            base_fieldsets[1][1]['fields'] += ('perfil_ativo',)

        if request.user.is_superuser:
            return base_fieldsets + (('Perfis do Sistema', {'fields': ('perfis',)}),)
        return base_fieldsets

    def get_readonly_fields(self, request, obj=None):
        if obj is None:
            return ['perfil_ativo']
        return super().get_readonly_fields(request, obj)
