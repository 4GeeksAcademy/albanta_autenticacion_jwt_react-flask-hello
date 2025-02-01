"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# 🔹 Ruta de prueba
@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message from the backend"
    }
    return jsonify(response_body), 200


# 🔹 Registro de usuario
@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    if not data or 'email' not in data or 'password' not in data:
        raise APIException("Faltan datos obligatorios", status_code=400)

    # Verificar si el usuario ya existe
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        raise APIException("El usuario ya está registrado", status_code=400)

    new_user = User(email=data['email'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuario registrado con éxito"}), 201


# 🔹 Inicio de sesión
@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or 'email' not in data or 'password' not in data:
        raise APIException("Correo y contraseña son obligatorios", status_code=400)

    user = User.query.filter_by(email=data['email']).first()

    if user and user.password == data['password']:  # 🔹 TODO: Agregar hash en producción
        token = create_access_token(identity=user.id)
        return jsonify({"message": "Inicio de sesión exitoso", "token": token}), 200
    else:
        raise APIException("Credenciales inválidas", status_code=401)


# 🔹 Ruta protegida (solo accesible con token)
@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        raise APIException("Usuario no encontrado", status_code=404)

    return jsonify({"id": user.id, "email": user.email, "message": "Acceso permitido"}), 200


# 🔹 Cierre de sesión (Solo frontend elimina el token de sessionStorage)
@api.route('/logout', methods=['POST'])
def logout():
    return jsonify({"message": "Sesión cerrada exitosamente"}), 200

