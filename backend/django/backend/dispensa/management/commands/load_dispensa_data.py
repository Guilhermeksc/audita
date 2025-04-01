import json
from django.core.management.base import BaseCommand
from django.utils import timezone
from backend.dispensa.models import DispensaEletronica
from datetime import datetime

class Command(BaseCommand):
    help = 'Loads initial dispensa eletronica data from JSON file'

    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str, help='Path to the JSON file')

    def handle(self, *args, **options):
        json_file = options['json_file']
        
        with open(json_file, 'r', encoding='utf-8') as file:
            data = json.load(file)
            
            # Filter only records where modalidadeId is 8
            filtered_data = [item for item in data if item['modalidadeId'] == 8]
            
            self.stdout.write(f'Found {len(filtered_data)} records with modalidadeId = 8')
            
            for item in filtered_data:
                # Convert date strings to datetime objects
                data_publicacao = datetime.fromisoformat(item['dataPublicacaoPncp'].replace('Z', '+00:00'))
                data_abertura = datetime.fromisoformat(item['dataAberturaProposta'].replace('Z', '+00:00'))
                data_encerramento = datetime.fromisoformat(item['dataEncerramentoProposta'].replace('Z', '+00:00'))
                data_inclusao = datetime.fromisoformat(item['dataInclusao'].replace('Z', '+00:00'))
                data_atualizacao = datetime.fromisoformat(item['dataAtualizacao'].replace('Z', '+00:00'))
                data_atualizacao_global = datetime.fromisoformat(item['dataAtualizacaoGlobal'].replace('Z', '+00:00'))
                
                # Create or update DispensaEletronica
                dispensa, created = DispensaEletronica.objects.update_or_create(
                    numero_controle_pncp=item['numeroControlePNCP'],
                    defaults={
                        'valor_total_estimado': item['valorTotalEstimado'],
                        'valor_total_homologado': item['valorTotalHomologado'],
                        'orcamento_sigiloso_codigo': item['orcamentoSigilosoCodigo'],
                        'orcamento_sigiloso_descricao': item['orcamentoSigilosoDescricao'],
                        'link_sistema_origem': item['linkSistemaOrigem'],
                        'link_processo_eletronico': item['linkProcessoEletronico'],
                        'ano_compra': item['anoCompra'],
                        'sequencial_compra': item['sequencialCompra'],
                        'numero_compra': item['numeroCompra'],
                        'processo': item['processo'],
                        'uf_nome': item['ufNome'],
                        'uf_sigla': item['ufSigla'],
                        'municipio_nome': item['municipioNome'],
                        'codigo_unidade': item['codigoUnidade'],
                        'nome_unidade': item['nomeUnidade'],
                        'modalidade_id': item['modalidadeId'],
                        'modalidade_nome': item['modalidadeNome'],
                        'justificativa_presencial': item['justificativaPresencial'],
                        'modo_disputa_id': item['modoDisputaId'],
                        'modo_disputa_nome': item['modoDisputaNome'],
                        'tipo_instrumento_convocatorio_codigo': item['tipoInstrumentoConvocatorioCodigo'],
                        'tipo_instrumento_convocatorio_nome': item['tipoInstrumentoConvocatorioNome'],
                        # Campos do amparoLegal
                        'amparo_legal_codigo': item['amparoLegal']['codigo'],
                        'amparo_legal_descricao': item['amparoLegal']['descricao'],
                        'amparo_legal_nome': item['amparoLegal']['nome'],
                        'objeto_compra': item['objetoCompra'],
                        'informacao_complementar': item['informacaoComplementar'],
                        'srp': item['srp'],
                        'data_publicacao_pncp': data_publicacao,
                        'data_abertura_proposta': data_abertura,
                        'data_encerramento_proposta': data_encerramento,
                        'situacao_compra_id': item['situacaoCompraId'],
                        'situacao_compra_nome': item['situacaoCompraNome'],
                        'existe_resultado': item['existeResultado'],
                        'data_inclusao': data_inclusao,
                        'data_atualizacao': data_atualizacao,
                        'data_atualizacao_global': data_atualizacao_global
                    }
                )
                
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Created dispensa: {dispensa}'))
                else:
                    self.stdout.write(self.style.SUCCESS(f'Updated dispensa: {dispensa}')) 