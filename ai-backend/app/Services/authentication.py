from flask import jsonify
from app.models import *
from werkzeug.security import generate_password_hash, check_password_hash

def register_user(fullName, phoneNumber, password, cin, city_name):
    # Vérifier si le CIN existe déjà
    existing_user = User.query.filter_by(cin=cin).first()
    if existing_user:
        return {'error': 'User with this CIN already exists'}, 400
    
    # Chercher la ville par son nom et région
    city = City.query.filter_by(name=city_name).first()
    if not city:
        return {'error': f'City "{city_name}" not found in region'}, 400


    # Hasher le mot de passe
    hashed_password = generate_password_hash(password)

    # Créer l'utilisateur
    new_user = User(
        fullName=fullName,
        phoneNumber=phoneNumber,
        password=hashed_password,
        cin=cin,

        CityId=city.id
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201



def login(phone,password):
    


    if not phone or not password:
        return jsonify({'error': 'Veuillez fournir phoneNumber et password'}), 400

    user = User.query.filter_by(phoneNumber=phone).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Numéro de téléphone ou mot de passe incorrect'}), 401

    # Ici tu pourrais générer un token JWT ou une session
    return jsonify({
        'message': 'Connexion réussie',
        'user': {
            'id': user.id,
            'phoneNumber': user.phoneNumber,
            'fullName': user.fullName
        }
    }),200