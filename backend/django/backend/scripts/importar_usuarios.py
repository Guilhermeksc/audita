import csv
from django.contrib.auth import get_user_model
from django.db import IntegrityError

Usuario = get_user_model()

def importar_usuarios_csv(caminho_arquivo_csv, senha_padrao='ccimar123'):
    """
    BIZU: Para rodar o script, abra o shell do Django e execute:
python manage.py shell 
    
from scripts.importar_usuarios import importar_usuarios_csv
importar_usuarios_csv("scripts/mil_depto_aud.csv")
    """

    with open(caminho_arquivo_csv, newline='', encoding='utf-8') as csvfile:
        leitor = csv.DictReader(csvfile, delimiter='|')
        total, inseridos, duplicados = 0, 0, 0

        for linha in leitor:
            nip = linha['usua_tx_nip'].strip().replace('"', '')
            total += 1
            try:
                Usuario.objects.create_user(
                    nip=nip,
                    password=senha_padrao,
                    nome_completo=linha['usua_nm_completo'].strip().replace('"', ''),
                    posto=linha['usua_tx_posto'].strip().replace('"', ''),
                    nome_funcao=linha['func_nm_completo'].strip().replace('"', ''),
                    divisao_acesso=linha['divi_nm_completo'].strip().replace('"', ''),
                    especialidade=linha.get('especialidade', '').strip().replace('"', ''),
                    nome_de_guerra=linha.get('nome_de_guerra', '').strip().replace('"', ''),
                    email=linha.get('email', '').strip().replace('"', ''),
                )
                inseridos += 1
            except IntegrityError:
                duplicados += 1
                print(f"NIP já existente: {nip}")
        
        print(f"Total: {total}, Inseridos: {inseridos}, Duplicados: {duplicados}")
