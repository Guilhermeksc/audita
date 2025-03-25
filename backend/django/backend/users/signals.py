from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from .models import Perfil

@receiver(post_migrate)
def criar_perfis_e_grupos(sender, **kwargs):
    try:
        perfis_hierarquia = {
            'Admin': ['Admin', 'Chefe da Auditoria', 'Vice-Diretor', 'Diretor',
                      'Auditor-11', 'Auditor-12', 'Auditor-13', 'Auditor-14', 'Auditor-15',
                      'Auxiliar-Auditor-11', 'Auxiliar-Auditor-12', 'Auxiliar-Auditor-13',
                      'Auxiliar-Auditor-14', 'Auxiliar-Auditor-15'],
            'Chefe da Auditoria': ['Chefe da Auditoria',
                                   'Auditor-11', 'Auditor-12', 'Auditor-13', 'Auditor-14', 'Auditor-15',
                                   'Auxiliar-Auditor-11', 'Auxiliar-Auditor-12', 'Auxiliar-Auditor-13',
                                   'Auxiliar-Auditor-14', 'Auxiliar-Auditor-15'],
            'Vice-Diretor': ['Vice-Diretor',
                             'Chefe da Auditoria', 'Auditor-11', 'Auditor-12', 'Auditor-13',
                             'Auditor-14', 'Auditor-15',
                             'Auxiliar-Auditor-11', 'Auxiliar-Auditor-12', 'Auxiliar-Auditor-13',
                             'Auxiliar-Auditor-14', 'Auxiliar-Auditor-15'],
            'Diretor': ['Diretor',
                        'Chefe da Auditoria', 'Vice-Diretor',
                        'Auditor-11', 'Auditor-12', 'Auditor-13', 'Auditor-14', 'Auditor-15',
                        'Auxiliar-Auditor-11', 'Auxiliar-Auditor-12', 'Auxiliar-Auditor-13',
                        'Auxiliar-Auditor-14', 'Auxiliar-Auditor-15'],
        }

        todos_perfis = set(p for perfis in perfis_hierarquia.values() for p in perfis)

        for nome in todos_perfis:
            Perfil.objects.get_or_create(nome=nome)

        for grupo_nome, acessos in perfis_hierarquia.items():
            grupo, _ = Group.objects.get_or_create(name=grupo_nome)
            grupo.permissions.clear()

            for acesso in acessos:
                codename = f'can_access_{acesso.lower().replace("-", "_").replace(" ", "_")}'
                name = f'Pode acessar como {acesso}'
                content_type = ContentType.objects.get_for_model(Perfil)

                perm, _ = Permission.objects.get_or_create(
                    codename=codename,
                    name=name,
                    content_type=content_type
                )
                grupo.permissions.add(perm)

    except Exception:
        pass