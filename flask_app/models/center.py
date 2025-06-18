from flask import flash
from flask_app.config.connectToProgreSql import PostgreSQLConnection


class Center:
    def __init__(self,data):
        self.id = data['id']
        self.name_centro = data['name_centro']
        self.pag_web = data['pag_web']
        self.api_link = data['api_link']
        self.email = data['email']
        self.address_id = data['address_id']
        #join con address
        self.address = data['address']

    @staticmethod
    def validate_centers(form):
        is_valid = True

        if len(form['name']) < 10:
            flash('La direccion debe tener al menos 10 caracteres', 'centros')
            is_valid = False

        if len(form['pag_web']) < 5:
            flash('El nombre del director debe tener al menos 5 caracteres', 'centros')
            is_valid = False

        return is_valid
    
    @classmethod
    def get_centros_by_comuna(cls, comuna_id):
        query = """
            SELECT 
                c.id, 
                c.name_centro, 
                c.pag_web, 
                c.api_link, 
                c.email,
                a.address, 
                a.number_add, 
                a.phone, 
                a.cell_phone,
                co.name_comuna
            FROM centers c
            JOIN address a ON c.address_id = a.id
            JOIN comunas co ON a.comuna_id = co.id
            WHERE co.id = %(comuna_id)s
            ORDER BY c.name_centro DESC;
        """
        data = {"comuna_id": comuna_id}
        results = connectToPostgreSQL('postgres').query_db(query, data)

        if not results:
            return []

        centros = []
        for row in results:
            centro = {
                "id": row['id'],
                "name_centro": row['name_centro'],
                "pag_web": row['pag_web'],
                "api_link": row['api_link'],
                "email": row['email'],
                "address": row['address'],
                "number_add": row['number_add'],
                "phone": row['phone'],
                "cell_phone": row['cell_phone'],
                "name_comuna": row['name_comuna']
            }
            centros.append(centro)

        return centros
    
    @classmethod
    def get_all_center_with_address_and_comunas(cls):
        query= "SELECT * FROM centers JOIN address ON centers.address_id = address.id ; "
        results = connectToPostgreSQL('postgres').query_db(query)
        centers = []
        for row in results:
            centers.append(cls(row))
        return centers
    
    @classmethod
    def create_center(cls, data):
        db = connectToPostgreSQL('postgres')
        
        # 1. Insertar en address
        query_address = """
        INSERT INTO address (address, number_add, phone, cell_phone, comuna_id)
        VALUES (%(address)s, %(number_add)s, %(phone)s, %(cell_phone)s, %(comuna_id)s)
        RETURNING id;
        """
        address_data = {
            "address": data["address"],
            "number_add": data["number_add"],
            "phone": data["phone"],
            "cell_phone": data["cell_phone"],
            "comuna_id": data["comuna_id"]
        }  
        address_id = db.query_db(query_address, address_data)

        print("Resultado de address_id:", address_id)
        print("Tipo:", type(address_id))

        if not address_id: 
            print("Error al crear dirección")
            return False

        # 2. Insertar en centers con el address_id obtenido
        center_query = """
        INSERT INTO centers (name_centro, pag_web, api_link, email, address_id)
        VALUES (%(name_centro)s, %(pag_web)s, %(api_link)s, %(email)s, %(address_id)s)
        RETURNING id;
        """
        center_data = {
            "name_centro": data["name_centro"],
            "pag_web": data["pag_web"],
            "api_link": data["api_link"],
            "email": data["email"],
            "address_id": address_id  # Ya es un número entero
        }
        center_id = db.query_db(center_query, center_data)

        if not center_id: 
            print("Error al crear centro")
            return False
        
        return center_id

    

    @classmethod
    def get_all_centros(cls):
        query = """
            SELECT c.id, c.name_centro, a.address, a.number_add, a.phone, a.cell_phone, 
                c.email, co.name_comuna
            FROM centers c
            JOIN address a ON c.address_id = a.id
            JOIN comunas co ON a.comuna_id = co.id
            ORDER BY co.name_comuna DESC;
        """
        connection = connectToPostgreSQL("postgres")
        return connection.query_db(query)
