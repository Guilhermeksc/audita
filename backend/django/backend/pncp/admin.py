# backend/django/backend/pncp/admin.py
import json
from datetime import datetime
from django import forms
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib import admin
from .models import PNCPModel

# Formulário para upload do arquivo JSON
class JSONUploadForm(forms.Form):
    json_file = forms.FileField()

@admin.register(PNCPModel)
class PNCPAdmin(admin.ModelAdmin):
    change_list_template = "pncp/json_pncp_upload.html"  # ou crie um link customizado
    

    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            # /admin/pncp/pncpmodel/import-json/
            path('import-json/', self.admin_site.admin_view(self.import_json_pncp), name='import-json-pncp'),
        ]
        return custom_urls + urls

    def import_json_pncp(self, request):
        if request.method == "POST":
            form = JSONUploadForm(request.POST, request.FILES)
            if form.is_valid():
                try:
                    data = json.load(request.FILES['json_file'])
                except json.JSONDecodeError as e:
                    messages.error(request, f"Erro ao ler JSON: {str(e)}")
                    return redirect("..")
                count = 0
                for item in data:
                    try:
                        pncp = PNCPModel(
                            valor_total_estimado=item.get("valorTotalEstimado"),
                            valor_total_homologado=item.get("valorTotalHomologado"),
                            orcamento_sigiloso_codigo=item.get("orcamentoSigilosoCodigo"),
                            orcamento_sigiloso_descricao=item.get("orcamentoSigilosoDescricao"),
                            numero_controle_pncp=item.get("numeroControlePNCP"),
                            link_sistema_origem=item.get("linkSistemaOrigem"),
                            link_processo_eletronico=item.get("linkProcessoEletronico"),
                            ano_compra=item.get("anoCompra"),
                            sequencial_compra=item.get("sequencialCompra"),
                            numero_compra=item.get("numeroCompra"),
                            processo=item.get("processo"),
                            uf_nome=item.get("ufNome"),
                            uf_sigla=item.get("ufSigla"),
                            municipio_nome=item.get("municipioNome"),
                            codigo_unidade=item.get("codigoUnidade"),
                            nome_unidade=item.get("nomeUnidade"),
                            modalidade_id=item.get("modalidadeId"),
                            modalidade_nome=item.get("modalidadeNome"),
                            justificativa_presencial=item.get("justificativaPresencial"),
                            modo_disputa_id=item.get("modoDisputaId"),
                            modo_disputa_nome=item.get("modoDisputaNome"),
                            tipo_instrumento_convocatorio_codigo=item.get("tipoInstrumentoConvocatorioCodigo"),
                            tipo_instrumento_convocatorio_nome=item.get("tipoInstrumentoConvocatorioNome"),
                            amparo_legal_codigo=item.get("amparoLegal", {}).get("codigo"),
                            amparo_legal_descricao=item.get("amparoLegal", {}).get("descricao"),
                            amparo_legal_nome=item.get("amparoLegal", {}).get("nome"),
                            objeto_compra=item.get("objetoCompra"),
                            informacao_complementar=item.get("informacaoComplementar"),
                            srp=item.get("srp", False),
                            data_publicacao_pncp=datetime.fromisoformat(item.get("dataPublicacaoPncp")),
                            data_abertura_proposta=datetime.fromisoformat(item.get("dataAberturaProposta")),
                            data_encerramento_proposta=datetime.fromisoformat(item.get("dataEncerramentoProposta")),
                            situacao_compra_id=item.get("situacaoCompraId"),
                            situacao_compra_nome=item.get("situacaoCompraNome"),
                            existe_resultado=item.get("existeResultado", False),
                            data_inclusao=datetime.fromisoformat(item.get("dataInclusao")),
                            data_atualizacao=datetime.fromisoformat(item.get("dataAtualizacao")),
                            data_atualizacao_global=datetime.fromisoformat(item.get("dataAtualizacaoGlobal")),
                        )
                        pncp.save()
                        count += 1
                    except Exception as e:
                        messages.error(request, f"Erro ao importar item: {str(e)}")
                messages.success(request, f'{count} registros importados com sucesso!')
                return redirect("..")
        else:
            form = JSONUploadForm()
        context = {'form': form, 'title': 'Importar JSON de PNCP'}
        return render(request, 'pncp/json_pncp_upload.html', context)
