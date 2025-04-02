import psycopg2

conn = psycopg2.connect(
    dbname="audita_db",
    user="postgres",
    password="postgres",
    host="localhost",  # ou 'postgres' se estiver usando Docker
    port="5432"
)
print("Conectado com sucesso!")
conn.close()