import psycopg2
from psycopg2.extras import DictCursor

class PostgreSQLConnection:
    def __init__(self, db):
        # Cambia estos datos según tu configuración en PostgreSQL
        self.connection = psycopg2.connect(
            host='localhost',  # Dirección del servidor
            user='postgres',   # Usuario de PostgreSQL
            password='1254',  # Tu contraseña
            dbname=db,  # Nombre de la base de datos
            port=5432, # Puerto por defecto de PostgreSQL
            options='-c search_path=public'
        )
        self.connection.autocommit = True

    def query_db(self, query, data=None):
        with self.connection.cursor(cursor_factory=DictCursor) as cursor:
            try:
                if data:
                    cursor.execute(query, data)
                else:
                    cursor.execute(query)

                self.connection.commit()  # Esto debe ejecutarse antes de retornar valores
                
                if query.strip().lower().startswith("insert"):
                    return cursor.fetchone()[0] if cursor.rowcount > 0 else None  # Devuelve el ID generado
                elif query.strip().lower().startswith("select"):
                    results = cursor.fetchall()
                return results if results else []  # Devuelve una lista vacía si no hay resultados


                
            except Exception as e:
                print(f"Error en la consulta SQL: {query}")
                print(f"Datos enviados: {data}")
                print(f"Error: {e}")
                return False
            

# Función para conectar a PostgreSQL
def connectToPostgreSQL(db):
    return PostgreSQLConnection(db)
