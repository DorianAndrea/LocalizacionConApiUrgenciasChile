from flask_app.config.connectToProgreSql import PostgreSQLConnection

from flask import flash

class Region:
    def __init__(self, id, region_name):
        self.id = id
        self.region_name = region_name

    @staticmethod
    def validate_region(form):
        is_valid = True
        if len(form['region_name']) < 1:
            flash("Debes seleccionar una región")
            is_valid = False
        return is_valid

    @classmethod
    def get_all(cls):
        query = "SELECT * FROM regiones;"
        results = PostgreSQLConnection().query_db(query)
        print("Intentando obtener regiones...")
        print("Resultado:", results)
        return [cls(**row) for row in results] 
