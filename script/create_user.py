import psycopg2
from psycopg2.extras import RealDictCursor
import bcrypt

# Conectar a la base de datos PostgreSQL
try:
    connection = psycopg2.connect(
        host="localhost",
        port=5432,
        user="postgres",       # Usuario de PostgreSQL
        password="1254",       # Contraseña del usuario
        dbname="postgres"      # Nombre de la base de datos
    )
    print("Conexión exitosa a la base de datos")
except Exception as e:
    print(f"Error al conectar a la base de datos: {e}")
    exit()

# Crear un cursor
cursor = connection.cursor(cursor_factory=RealDictCursor)

# Datos del usuario
password = "1234567"
hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Verificar el hash en la terminal para asegurar su correcto almacenamiento
print(f"Hashed Password: {hashed_password}")

# Datos del usuario administrador
user_data = {
    'first_name': 'Manuel',
    'last_name': 'Pontio',
    'rut': '12345678-9',
    'email': 'mpontior@gmail.com',
    'password': hashed_password
}

# Consulta SQL para insertar el usuario
query = """
INSERT INTO users (first_name, last_name, rut, email, password, created_at, updated_at)
VALUES (%(first_name)s, %(last_name)s, %(rut)s, %(email)s, %(password)s, NOW(), NOW())
RETURNING id;
"""

try:
    # Ejecutar la consulta
    cursor.execute(query, user_data)
    user_id = cursor.fetchone()['id']
    connection.commit()
    print(f"Usuario creado con ID: {user_id}")

    # Verificar si el hash funciona
    if bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')):
        print("Verificación de contraseña: Correcta")
    else:
        print("Verificación de contraseña: Incorrecta")

except Exception as e:
    print(f"Error al crear el usuario: {e}")
finally:
    # Cerrar la conexión
    cursor.close()
    connection.close()
