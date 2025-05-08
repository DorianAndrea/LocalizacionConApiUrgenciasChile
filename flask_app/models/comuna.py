from flask_app.config.connectToProgreSql import connectToPostgreSQL;
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
    def get_all_comunas (cls):
        query = "SELECT * FROM comunas;"
        results = connectToPostgreSQL('postgres').query_db(query)
        comunas= []
        for row in results:
            comunas.append(cls(row))
        return comunas
    
    @classmethod
    def get_comunas_by_region(cls, region_id):
        query = "SELECT * FROM comunas WHERE region_id = %(region_id)s;"
        results = connectToPostgreSQL('postgres').query_db(query, {'region_id': region_id})
        comunas = []
        for row in results:
            comunas.append(cls(row))
        return comunas