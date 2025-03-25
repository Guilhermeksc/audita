import os
import json
from datetime import datetime

from django.core.management.base import BaseCommand
from backend.diario.models import DiarioOficial 

class Command(BaseCommand):
    help = 'Importa os dados do arquivo diario_oficial.json para o banco de dados'

    def handle(self, *args, **kwargs):
        caminho = os.path.join(os.getcwd(), 'diario_oficial.json')
        if not os.path.exists(caminho):
            self.stdout.write(self.style.ERROR('Arquivo diario_oficial.json não encontrado no diretório atual.'))
            return

        with open(caminho, 'r', encoding='utf-8') as f:
            dados = json.load(f)

        total = 0
        for ano, meses in dados.items():
            for mes, tipos in meses.items():
                for tipo, orgaos in tipos.items():
                    for orgao, registros in orgaos.items():
                        for r in registros:
                            try:
                                data_pub = datetime.strptime(r['pubDate'], "%d/%m/%Y").date()
                            except ValueError:
                                continue

                            if not DiarioOficial.objects.filter(id_materia=r['idMateria']).exists():
                                DiarioOficial.objects.create(
                                    ano=int(ano),
                                    mes=mes,
                                    tipo=tipo,
                                    orgao=orgao,
                                    data_publicacao=data_pub,
                                    link_pdf=r['pdfPage'],
                                    edicao=r['editionNumber'],
                                    name=r['name'],
                                    id_materia=r['idMateria'],
                                    identifica=r['identifica'],
                                    texto_completo=r['texto_completo']
                                )
                                total += 1

        self.stdout.write(self.style.SUCCESS(f'{total} registros importados com sucesso.'))
