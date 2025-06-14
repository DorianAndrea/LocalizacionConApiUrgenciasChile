from flask_app.config.connectToProgreSql import connectToPostgreSQL;
from flask import flash

class Region:
    def __init__( self , data ):
        self.id = data['id']
        self.region_name = data['region_name']

    @staticmethod
    def validate_region(form):
        is_valid = True
        if len(form['region_name']) < 1:
            flash("Debes seleccionar una región")
            is_valid = False
        
        return is_valid
    
    @classmethod
    def get_all (cls):
        query = "SELECT * FROM regiones;"
        results = connectToPostgreSQL('postgres').query_db(query)
        regions= []
        for row in results:
            regions.append(cls(row))
        return regions
        
