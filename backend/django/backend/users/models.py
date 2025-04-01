from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager,Group
from django.db import models

class UsuarioManager(BaseUserManager):
    def create_user(self, nip, password=None, **extra_fields):
        if not nip:
            raise ValueError('O NIP deve ser fornecido.')
        user = self.model(nip=nip, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, nip, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(nip, password, **extra_fields)

class Perfil(models.Model):
    nome = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Perfil"
        verbose_name_plural = "Perfis"

    def __str__(self):
        return self.nome

class Usuario(AbstractBaseUser, PermissionsMixin):
    posto = models.CharField(max_length=30)
    especialidade = models.CharField(max_length=50, blank=True, null=True)
    nome_completo = models.CharField(max_length=255)
    nome_de_guerra = models.CharField(max_length=100, blank=True, null=True)

    nip = models.CharField(max_length=8, unique=True)
    nome_funcao = models.CharField(max_length=100)
    
    perfis = models.ManyToManyField(Perfil, related_name='usuarios')
    perfil_ativo = models.ForeignKey(
        Perfil, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='usuarios_ativos'
    )
    divisao = models.CharField(max_length=100)

    email = models.EmailField(blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()
    USERNAME_FIELD = 'nip'
    REQUIRED_FIELDS = ['nome_completo', 'posto']

    def __str__(self):
        return f'{self.nome_completo} ({self.nip})'

    def aplicar_grupo_perfil_ativo(self):
        """Associa o grupo com o nome do perfil_ativo ao usuário."""
        if self.perfil_ativo:
            # Remove todos os grupos anteriores
            self.groups.clear()
            # Adiciona o grupo que corresponde ao perfil ativo
            grupo = Group.objects.filter(name=self.perfil_ativo.nome).first()
            if grupo:
                self.groups.add(grupo)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.aplicar_grupo_perfil_ativo()                