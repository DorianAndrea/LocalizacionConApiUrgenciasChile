from flask_app.config.connectToProgreSql import PostgreSQLConnection


class Address:
    def __init__(self, data):
        self.id = data['id']
        self.address = data['address']
        self.number_add = data['number_add']
        self.phone = data['phone']
        self.cell_phone = data['cell_phone']
        #join con comuna
        self.name_comuna = data['name_comuna']
        

    @classmethod
    def get_all_address_whith_comuna(cls):
        query = "SELECT * FROM address JOIN comunas ON address.comuna_id = comunas.id;"
        results = PostgreSQLConnection('postgres').query_db(query)
        direcciones = []
        for row in results:
            direcciones.append(cls(row))
        return direcciones
    
    @classmethod
    def create(cls, data):
        query = "INSERT INTO address (address, number_add, phone, cell_phone, comuna_id) VALUES (%(address)s, %(number_add)s, %(phone)s, %(cell_phone)s, %(comuna_id)s) RETURNING id;"
        result = PostgreSQLConnection('postgres').query_db(query, data)
        return result
    
    
        