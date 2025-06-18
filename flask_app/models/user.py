from flask_app.config.connectToProgreSql import PostgreSQLConnection

from flask import flash
from flask_bcrypt import Bcrypt 
import re

bcrypt = Bcrypt()  # <-- Instancia para usar bcrypt

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')


class User:
    def __init__(self, data):
        self.id = data['id']
        self.first_name = data['first_name']
        self.last_name = data['last_name']
        self.rut = data['rut']
        self.email = data['email']
        self.password = data['password']
        self.created_at = data['created_at']

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'rut': self.rut,
            'email': self.email,
            'created_at': self.created_at
        }
    

    @classmethod
    def save(cls, data):
        print("Guardando nuevo usuario en la base de datos...")

        # Hashear la contraseña antes de guardar
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

        data_to_insert = {
            'first_name': data['first_name'],
            'last_name': data['last_name'],
            'rut': data['rut'],
            'email': data['email'],
            'password': hashed_password  # <-- Aquí ya encriptada
        }

        query = """
        INSERT INTO users(first_name, last_name, rut, email, password)
        VALUES(%(first_name)s, %(last_name)s, %(rut)s, %(email)s, %(password)s)
        RETURNING id;
        """
        result = connectToPostgreSQL('postgres').query_db(query, data_to_insert)
        return result

    @staticmethod
    def validate_user(data):
        is_valid = True

        if len(data['first_name']) < 2:
            flash("El nombre debe tener al menos 2 caracteres", "register")
            print("Nombre inválido")
            is_valid = False

        if len(data['last_name']) < 2:
            flash("El apellido debe tener al menos 2 caracteres", "register")
            print("Apellido inválido")
            is_valid = False

        if not EMAIL_REGEX.match(data['email']):
            flash("Correo electrónico inválido", "register")
            print("Email inválido")
            is_valid = False

        if data['password'] != data['confirmPassword']:
            flash("Las contraseñas no coinciden", "register")
            print("Contraseñas distintas")
            is_valid = False

        if len(data['password']) < 6:
            flash("La contraseña debe tener al menos 6 caracteres", "register")
            print("Contraseña muy corta")
            is_valid = False

        return is_valid

    @classmethod
    def get_all(cls):
        query = "SELECT * FROM users"
        results = connectToPostgreSQL('postgres').query_db(query)
        users = []
        for result in results:
            users.append(cls(result))
        return users

    @classmethod
    def get_by_email(cls, email):
        query = "SELECT * FROM users WHERE email = %(email)s"
        data = {'email': email}
        result = connectToPostgreSQL('postgres').query_db(query, data)
        if result:
            return cls(result[0])
        return None

    @classmethod
    def get_by_id(cls, data):
        query = "SELECT * FROM users WHERE id = %(id)s"
        result = connectToPostgreSQL('postgres').query_db(query, data)
        user = cls(result[0])
        return user
