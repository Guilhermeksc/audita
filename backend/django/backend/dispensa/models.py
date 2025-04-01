from django.db import models

class AmparoLegal(models.Model):
    codigo = models.IntegerField()
    descricao = models.TextField()
    nome = models.CharField(max_length=255)

    class Meta:
        db_table = 'amparo_legal'

class DispensaEletronica(models.Model):
    valor_total_estimado = models.DecimalField(max_digits=15, decimal_places=2)
    valor_total_homologado = models.DecimalField(max_digits=15, decimal_places=2)
    orcamento_sigiloso_codigo = models.IntegerField()
    orcamento_sigiloso_descricao = models.CharField(max_length=255)
    numero_controle_pncp = models.CharField(max_length=255)
    link_sistema_origem = models.URLField(null=True, blank=True)
    link_processo_eletronico = models.URLField(null=True, blank=True)
    ano_compra = models.IntegerField()
    sequencial_compra = models.IntegerField()
    numero_compra = models.CharField(max_length=50)
    processo = models.CharField(max_length=50)
    uf_nome = models.CharField(max_length=100)
    uf_sigla = models.CharField(max_length=2)
    municipio_nome = models.CharField(max_length=100)
    codigo_unidade = models.CharField(max_length=50)
    nome_unidade = models.CharField(max_length=255)
    modalidade_id = models.IntegerField()
    modalidade_nome = models.CharField(max_length=100)
    justificativa_presencial = models.TextField(null=True, blank=True)
    modo_disputa_id = models.IntegerField()
    modo_disputa_nome = models.CharField(max_length=100)
    tipo_instrumento_convocatorio_codigo = models.IntegerField()
    tipo_instrumento_convocatorio_nome = models.CharField(max_length=255)
    # Campos do amparoLegal incorporados diretamente
    amparo_legal_codigo = models.IntegerField()
    amparo_legal_descricao = models.TextField()
    amparo_legal_nome = models.CharField(max_length=255)
    objeto_compra = models.TextField()
    informacao_complementar = models.TextField(null=True, blank=True)
    srp = models.BooleanField(default=False)
    data_publicacao_pncp = models.DateTimeField()
    data_abertura_proposta = models.DateTimeField()
    data_encerramento_proposta = models.DateTimeField()
    situacao_compra_id = models.IntegerField()
    situacao_compra_nome = models.CharField(max_length=100)
    existe_resultado = models.BooleanField(default=False)
    data_inclusao = models.DateTimeField()
    data_atualizacao = models.DateTimeField()
    data_atualizacao_global = models.DateTimeField()

    class Meta:
        db_table = 'dispensa_eletronica'
        ordering = ['-data_publicacao_pncp']

    def __str__(self):
        return f"{self.numero_compra} - {self.objeto_compra[:50]}" 