from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Perfil
from .forms import CustomUserCreationForm, CustomUserChangeForm
        
@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome')
    search_fields = ('nome',)
    
@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    model = Usuario
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm

    ordering = ['nip']
    list_display = (
        'nip', 'nome_completo', 'nome_de_guerra', 'posto',
        'especialidade', 'nome_funcao', 'divisao', 'email',
        'get_perfis', 'is_staff',
    )
    search_fields = ('nip', 'nome_completo', 'nome_de_guerra', 'email')
    filter_horizontal = ('perfis',)

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('nip', 'nome_completo', 'posto', 'password1', 'password2'),
        }),
    )
    def add_view(self, request, form_url='', extra_context=None):
        import logging
        logger = logging.getLogger(__name__)
        logger.error("🚨 Entrou no add_view() do UsuarioAdmin")

        if request.method == 'POST':
            form_class = self.get_form(request, obj=None, change=False)
            form = form_class(request.POST)
            if not form.is_valid():
                logger.error("== ERROS NO FORMULÁRIO ==")
                for field, errors in form.errors.items():
                    logger.error(f"{field}: {errors}")
                if form.non_field_errors():
                    logger.error(f"Erros não relacionados a campos: {form.non_field_errors()}")
                logger.error("== FIM DOS ERROS ==")

        return super().add_view(request, form_url, extra_context)

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
                    'nome_completo', 'nome_de_guerra', 'posto', 'especialidade',
                    'nome_funcao', 'divisao', 'email',
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

    def get_readonly_fields(self, request, obj=None):
        if obj is None:
            return ['perfil_ativo']
        return super().get_readonly_fields(request, obj)