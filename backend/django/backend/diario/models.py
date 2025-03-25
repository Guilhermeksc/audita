from django.db import models

class DiarioOficial(models.Model):
    ano = models.PositiveSmallIntegerField()
    mes = models.CharField(max_length=3)
    tipo = models.CharField(max_length=100)
    orgao = models.CharField(max_length=255)
    data_publicacao = models.DateField()
    link_pdf = models.URLField(max_length=500)
    edicao = models.CharField(max_length=50)

    name = models.CharField(max_length=255)
    id_materia = models.CharField(max_length=50, unique=True)
    identifica = models.TextField()
    texto_completo = models.TextField()

    # Campos auditáveis
    registro = models.CharField(max_length=100, null=True, blank=True)
    auditado = models.BooleanField(default=False)
    comentario = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "diario_oficial"
        indexes = [
            models.Index(fields=["ano", "mes", "orgao"]),
            models.Index(fields=["data_publicacao"]),
            models.Index(fields=["auditado"]),
            models.Index(fields=["id_materia"]),
        ]
        ordering = ["-data_publicacao"]

    def __str__(self):
        return f"{self.identifica[:80]}"
