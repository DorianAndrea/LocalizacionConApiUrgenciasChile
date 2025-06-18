from flask_app.config.connectToProgreSql import PostgreSQLConnection

from flask import flash

class Comuna:
    def __init__(self, data):
        self.id = data['id']
        self.name_comuna = data['name_comuna']
        self.region_id = data['region_id']
    
    @staticmethod
    def validate_comuna(form):
        is_valid = True
        if len(form['name_comuna']) < 1:
            flash("Debes seleccionar una comuna")
            is_valid = False
        return is_valid

    @classmethod
    def get_all_comunas(cls):
        query = "SELECT * FROM comunas;"
        results = PostgreSQLConnection('postgres').query_db(query)
        return [cls(row) for row in results]

    @classmethod
    def get_comunas_by_region(cls, region_id):
        query = "SELECT * FROM comunas WHERE region_id = %(region_id)s;"
        results = PostgreSQLConnection('postgres').query_db(query, {'region_id': region_id})
        return [cls(row) for row in results]
