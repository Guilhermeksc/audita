from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import zipfile
import os
import xml.etree.ElementTree as ET
import requests
from datetime import datetime
from django.db import IntegrityError
from airflow.models import DagRun
from backend.backend.diario.models import DiarioOficial

def initialize_driver():
    options = Options()
    options.add_argument("--headless")  # Executa sem abrir janela
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=options)
    return driver

def get_current_month_year():
    # Obtém o mês e ano atuais
    from datetime import datetime
    today = datetime.today()
    month = today.month
    year = today.year
    return month, year

def select_year(driver, current_month, current_year):
    year = current_year
    if current_month == 1:
        year -= 1  # Janeiro -> Escolher ano anterior
    else:
        year = current_year  # Caso contrário, escolher o ano atual
    
    # Aguarda o carregamento da lista de anos
    wait = WebDriverWait(driver, 20)
    select_element = wait.until(
        EC.presence_of_element_located((By.ID, "ano-dados"))
    )
    
    # Alternativa: Em vez de buscar por texto exato, podemos buscar pela opção
    options = select_element.find_elements(By.TAG_NAME, "option")
    
    # Localiza o ano correto na lista de opções
    for option in options:
        if option.text.strip() == str(year):
            option.click()
            print(f"✅ Ano {year} selecionado.")
            break
    else:
        print(f"🚨 Ano {year} não encontrado.")

def select_month(driver, current_month, current_year):
    month_names = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]
    
    # Determina o mês anterior
    prev_month = current_month - 1 if current_month > 1 else 12
    prev_month_name = month_names[prev_month - 1]  # Ajusta o índice para 0 baseado no mês

    # Aguarda o carregamento da lista de meses
    wait = WebDriverWait(driver, 20)
    select_element = wait.until(
        EC.presence_of_element_located((By.ID, "mes-dados"))
    )

    # Localiza novamente o elemento de mês, após o carregamento do DOM
    months = select_element.find_elements(By.TAG_NAME, "option")
    
    # Seleciona o mês anterior
    for month in months:
        if month.text.strip() == prev_month_name:
            month.click()
            print(f"✅ Mês {prev_month_name} selecionado.")
            break
    else:
        print(f"🚨 Mês {prev_month_name} não encontrado.")


def month_name(month_number):
    # Converte o número do mês em nome do mês
    months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]
    return months[month_number - 1]

def find_and_download_zip(driver, month, year):
    # Define the correct file name pattern starting with S03
    zip_filename = f"S03{month:02d}{year}.zip"  # Ajustando para incluir 'S03' no início
    print(f"Procurando arquivo {zip_filename}...")

    # Aguarda a lista de links de arquivos carregar
    wait = WebDriverWait(driver, 20)
    ul_element = wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "ul.dados-abertos-lista"))
    )

    # Busca os links de arquivos
    links = ul_element.find_elements(By.TAG_NAME, "a")
    
    for link in links:
        href = link.get_attribute("href")
        if zip_filename in href:
            print(f"✅ Arquivo {zip_filename} encontrado: {href}")
            # Aqui você pode adicionar o código para baixar o arquivo
            return href
    print(f"🚨 Arquivo {zip_filename} não encontrado.")
    return None

def download_file(url):
    # Baixa o arquivo
    import requests
    response = requests.get(url)
    file_name = url.split("/")[-1]
    
    with open(f"airflow-projeto/data/{file_name}", "wb") as f:
        f.write(response.content)
    print(f"✅ Arquivo {file_name} baixado com sucesso!")

def download_and_extract_zip(url, save_dir):
    """Baixa e extrai o arquivo ZIP na pasta especificada."""
    response = requests.get(url)
    zip_filename = os.path.join(save_dir, url.split("/")[-1])

    with open(zip_filename, "wb") as f:
        f.write(response.content)
    print(f"✅ Arquivo {zip_filename} baixado com sucesso!")

    # Extrai o ZIP
    with zipfile.ZipFile(zip_filename, 'r') as zip_ref:
        zip_ref.extractall(save_dir)
    print(f"✅ Arquivos extraídos para {save_dir}")
    
    return zip_filename

def parse_and_save_xml(xml_file, current_year, current_month):
    """Parseia os arquivos XML e salva no banco de dados."""
    tree = ET.parse(xml_file)
    root = tree.getroot()
    
    for article in root.findall('article'):
        id_materia = article.get('idMateria')
        tipo = article.get('artType')
        orgao = article.get('artCategory')
        data_publicacao = article.get('pubDate')
        link_pdf = article.get('pdfPage')
        edicao = article.get('editionNumber')
        identifica = article.find('Identifica').text
        texto_completo = article.find('Texto').text

        try:
            # Converte data de publicação
            data_publicacao = datetime.strptime(data_publicacao, "%d/%m/%Y").date()

            # Salva no banco de dados
            diario_oficial = DiarioOficial(
                ano=current_year,
                mes=month_name(current_month),
                tipo=tipo,
                orgao=orgao,
                data_publicacao=data_publicacao,
                link_pdf=link_pdf,
                edicao=edicao,
                name=f"DO_{id_materia}",
                id_materia=id_materia,
                identifica=identifica,
                texto_completo=texto_completo,
                auditado=False
            )
            diario_oficial.save()
            print(f"✅ Artigo {id_materia} salvo com sucesso!")
        except IntegrityError:
            print(f"🚨 Artigo {id_materia} já existe no banco de dados.")
            
def raspar_anos_disponiveis():
    driver = initialize_driver()
    driver.get("https://www.in.gov.br/acesso-a-informacao/dados-abertos/base-de-dados")
    
    try:
        current_month, current_year = get_current_month_year()

        # Seleciona o ano
        select_year(driver, current_month, current_year)
        
        # Seleciona o mês
        select_month(driver, current_month, current_year)

        # Encontra o arquivo ZIP
        zip_url = find_and_download_zip(driver, current_month - 1, current_year)
        if zip_url:
            save_dir = "/opt/airflow/data"  # Diretório para salvar o arquivo ZIP e extrair
            download_and_extract_zip(zip_url, save_dir)
            
            # Processa os arquivos XML extraídos
            extracted_files = os.listdir(save_dir)
            for file in extracted_files:
                if file.endswith(".xml"):
                    xml_path = os.path.join(save_dir, file)
                    parse_and_save_xml(xml_path, current_year, current_month)
    
    finally:
        driver.quit()