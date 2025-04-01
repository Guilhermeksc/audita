from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Perfil
from .forms import CustomUserCreationForm, CustomUserChangeForm, CSVUploadForm
from django.urls import path
from django.shortcuts import render, redirect
from django.contrib import messages
import csv

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

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('import-csv/', self.admin_site.admin_view(self.import_csv), name='import-csv-usuarios'),
        ]
        return custom_urls + urls

    def import_csv(self, request):
        if request.method == "POST":
            form = CSVUploadForm(request.POST, request.FILES)
            if form.is_valid():
                csv_file = request.FILES['csv_file']
                decoded_file = csv_file.read().decode('utf-8').splitlines()
                reader = csv.DictReader(decoded_file, delimiter='|')

                count = 0
                for row in reader:
                    nip = row['usua_tx_nip'].replace('"', '').strip()
                    if not Usuario.objects.filter(nip=nip).exists():
                        user = Usuario.objects.create_user(
                            nip=nip,
                            password="audita10",
                            nome_completo=row['usua_nm_completo'].strip(),
                            nome_funcao=row['func_nm_completo'].strip(),
                            divisao=row['divi_nm_completo'].strip(),
                            posto=row['usua_tx_posto'].replace('"', '').strip()
                        )
                        count += 1
                messages.success(request, f'{count} usuários importados com sucesso!')
                return redirect("..")  # volta para a lista de usuários
        else:
            form = CSVUploadForm()

        context = {'form': form, 'title': 'Importar CSV de Usuários'}
        return render(request, 'admin/csv_upload.html', context)