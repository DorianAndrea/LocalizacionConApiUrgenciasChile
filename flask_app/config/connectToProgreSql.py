import os
import psycopg2
from psycopg2.extras import RealDictCursor  # Esta es la clave

class PostgreSQLConnection:
    def __init__(self):
        db_url = os.getenv("DATABASE_URL")
        if not db_url:
            raise Exception("DATABASE_URL no está definida en el entorno")
        try:
            self.connection = psycopg2.connect(
                db_url,
                cursor_factory=RealDictCursor  # Esto permite retornar dicts directamente
            )
            self.connection.autocommit = True
        except Exception as e:
            raise Exception(f"Error al conectar a la base de datos: {e}")

    def query_db(self, query, data=None):
        with self.connection.cursor() as cursor:
            try:
                if data:
                    cursor.execute(query, data)
                else:
                    cursor.execute(query)

                if query.strip().lower().startswith("select"):
                    return cursor.fetchall()  # Esto ya será una lista de diccionarios
                elif query.strip().lower().startswith("insert"):
                    return cursor.fetchone()[0] if cursor.rowcount > 0 else None
                return []
            except Exception as e:
                print(f"Error en la consulta SQL: {query}")
                print(f"Datos enviados: {data}")
                print(f"Error: {e}")
                return []
