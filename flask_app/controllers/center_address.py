from flask import request, jsonify
from flask_app import app
from flask_app.models.center import Center

@app.route('/api/centros', methods=['GET'])
def get_centros():
    region_id = request.args.get('regionId')
    comuna_id = request.args.get('comunaId')
    print(f"Petición recibida con region_id={region_id} y comuna_id={comuna_id}")   
    if not region_id or not comuna_id:
        return jsonify({'error': 'Faltan parámetros de región o comuna'}), 400

    try:
        # Recuperar centros filtrados por comuna (ya que comuna está ligada a región)
        centros = Center.get_centros_by_comuna(comuna_id)
        print(f"Centros recuperados: {centros}")
        # Log para depuración
        print("Centros recuperados:", centros)

        return jsonify(centros)
    except Exception as e:
        print(f"Error en get_centros: {e}")
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/centros/allcenters', methods=['GET'])
def get_all_centros():
    try:
        centros = Center.get_all_centros()
        print(f"Centros listados: {centros}")
        return jsonify(centros)
    except Exception as e:
        print(f"Error al obtener todos los centros: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/centros', methods=['POST'])
def crear_centro():
    data = request.get_json()
    print("Datos recibidos para crear centro:", data)

    if not data:
        return jsonify({'error': 'No se recibieron datos'}), 400

    try:
        nuevo_id = Center.create_center(data)
        print("Centro creado con ID:", nuevo_id)
        return jsonify({'message': 'Centro creado exitosamente', 'id': nuevo_id}), 201
    except Exception as e:
        print("Error al crear centro:", e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/test', methods=['GET'])
def test_db_connection():
    try:
        from flask_app.config.connectToProgreSql import PostgreSQLConnection
        db = PostgreSQLConnection()
        result = db.query_db("SELECT NOW();")
        return jsonify({"conexion": "exitosa", "timestamp": result})
    except Exception as e:
        return jsonify({"conexion": "fallida", "error": str(e)})
