from flask import request, session, jsonify, redirect
from flask_app import app
from flask_cors import cross_origin
#importamos todos los modelos
from flask_app.models.user import User
# importar contraseña
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt(app)


@app.route('/api/registro', methods=['POST'])
def register_user():
    data = request.get_json()
    print("Datos recibidos del formulario:", data) 
    if not User.validate_user(data):
        return jsonify({'error': 'Datos inválidos. Revisa los campos e intenta nuevamente'}), 400

    
    pass_encrypt = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    form = {
        "first_name": data['first_name'],
        "last_name": data['last_name'],
        "rut": data['rut'],
        "email": data['email'],
        "password": pass_encrypt
    }
    
    new_id = User.save(data)
    print(f"Nuevo ID de usuario: {new_id}") 
    if new_id:
        return jsonify({"id": new_id}), 201
    else:
        return jsonify({"message": "Error al registrar el usuario"}), 500
    # Guardar el usuario en la base de datos
    new_id = User.save(user_data)
    if new_id:
        print(f"Usuario administrador creado con ID: {new_id}")
    else:
        print("Error al crear el usuario administrador")



@app.route('/api/login', methods=['POST'])
@cross_origin()
def login_user():
    data = request.get_json()
    email = data['email']
    password = data['password']

    # Obtener el usuario desde la base de datos
    user = User.get_by_email(email)

    if user:
        # Obtener el hash de la base de datos
        stored_hash = user.password

        # Verificar si la contraseña ingresada coincide con el hash almacenado
        if bcrypt.check_password_hash(stored_hash, password):
            # Contraseña correcta
            session['user_id'] = user.id
            print(f"Usuario {user.email} ha iniciado sesión correctamente.")
            return jsonify({'message': 'Inicio de sesión exitoso'}), 200
        else:
            # Contraseña incorrecta
            print("Contraseña incorrecta")
            return jsonify({'error': 'Correo electrónico o contraseña incorrectos'}), 401
    else:
        # Usuario no encontrado
        print("Usuario no encontrado")
        return jsonify({'error': 'Correo electrónico o contraseña incorrectos'}), 401

@app.route('/api/users', methods=['GET'])
@cross_origin()
def get_users():
    users = User.get_all()
    if not users:
        return jsonify({"message": "No se encontraron usuarios"}), 404
    return jsonify([user.to_dict() for user in users]), 200

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.get_by_id({"id": user_id})
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404
    return jsonify(user.to_dict())

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    user = User.update(data, user_id)
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404
    return jsonify(user.to_dict())

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.delete(user_id)
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404
    return jsonify({"message": "Usuario eliminado correctamente"})

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/") 

