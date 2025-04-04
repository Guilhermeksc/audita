import os
import json
import pandas as pd

def processar_riscos(arquivo, abas, colunas, saida_json):
    """
    Lê um arquivo Excel (xlsx) ou ODT/ODS, extrai dados das abas especificadas
    e salva as informações em um arquivo JSON.
    """
    if not os.path.exists(arquivo):
        raise FileNotFoundError(f"Arquivo não encontrado: {arquivo}")

    ext = os.path.splitext(arquivo)[1].lower()
    engine = None
    if ext in [".ods", ".odt"]:
        engine = "odf"

    resultados = {}
    for aba in abas:
        try:
            if engine:
                df = pd.read_excel(arquivo, sheet_name=aba, engine=engine)
            else:
                df = pd.read_excel(arquivo, sheet_name=aba)
            df_filtrado = df[colunas]
            resultados[aba] = df_filtrado.to_dict(orient="records")
            print(f"--- Dados da aba '{aba}' ---")
            print(df_filtrado)
        except Exception as e:
            print(f"Erro ao processar a aba '{aba}': {e}")

    with open(saida_json, "w", encoding="utf-8") as f:
        json.dump(resultados, f, ensure_ascii=False, indent=4)
    print(f"\nDados salvos em: {saida_json}")

if __name__ == "__main__":
    arquivo_entrada = "import_riscos.xlsx"  # Pode ser substituído por "import_riscos.ods" ou "import_riscos.odt"
    abas_desejadas = ["licitacao", "execucao", "recursos_humanos", "patrimonio", "municiamento"]
    colunas_desejadas = ["codigo", "risco", "descricao"]
    arquivo_saida = "riscos.mock.json"

    processar_riscos(arquivo_entrada, abas_desejadas, colunas_desejadas, arquivo_saida)
