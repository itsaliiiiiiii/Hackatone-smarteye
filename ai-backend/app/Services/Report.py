import requests
from flask import jsonify
import re
from .DL import *
from app.models import *
import os


UPLOAD_FOLDER = 'uploads'  # dossier où stocker les images
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # créer s'il n'existe pas

import base64

def save_image_file(image_data, filename):
    # Si image_data est une chaîne, on suppose base64 => on décode en bytes
    if isinstance(image_data, str):
        image_bytes = base64.b64decode(image_data)
    else:
        image_bytes = image_data

    path = f"uploads/{filename}"
    with open(path, "wb") as f:
        f.write(image_bytes)
    return path



def get_city_from_coordinates(lat, lon):
    """
    Prend une latitude et longitude et retourne le nom de la ville associée.
    """
    url = f'https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json'
    headers = {'User-Agent': 'MyApp/1.0'}

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        address = data.get('address', {})
        city = address.get('city') or address.get('town') or address.get('village') or ''
        match = re.match(r'[A-Za-zÀ-ÿ\s\-]+', city)
        if match:
            city= match.group(0).strip()
        
        return city

    except requests.RequestException as e:
        print(f"Erreur lors de la requête : {e}")
        return jsonify({"error":"error ,dans les cordonner"}),400



def get_Result(id_user,img, desc, x, y, i_bytes):
    ville = get_city_from_coordinates(x, y)
    print(ville)

    predictions, img_base64 = detect_and_classify2(img)

    city = City.query.filter_by(name=ville).first()
    if not city:
        return jsonify({"error": f"{ville} not found in db"}), 404

    agence = Agency.query.filter_by(problem_types=predictions[0]['class'], CityId=city.id).first()
    if not agence:
        return jsonify({"error": "agence not found in db"}), 404

    # Créer le report en base sans images pour récupérer l'id
    new_report = Report(
        problemType=predictions[0]['class'],
        status='pending',
        priority='high',
        UserId=id_user,
        CityId=city.id,
        AgencyId=agence.id
    )
    db.session.add(new_report)
    db.session.commit()

    # Créer les noms fichiers uniques
    image_filename = f"initial_{new_report.id}.jpg"
    image_filename_annoter = f"annotter_{new_report.id}.jpg"

    # Sauvegarder l'image brute (bytes) - supposée dans i_bytes
    saved_image_path1 = save_image_file(i_bytes, image_filename)

    # Décoder la chaîne base64 de l'image annotée
    img_annoter_bytes = base64.b64decode(img_base64.split(",")[-1])  # gérer le préfixe 'data:image/jpeg;base64,...' si présent

    saved_image_path2 = save_image_file(img_annoter_bytes, image_filename_annoter)

    # Mettre à jour le report avec les chemins
    new_report.image = saved_image_path1
    new_report.image_annoter = saved_image_path2

    db.session.commit()

    return jsonify({
        "image": img_base64,
        "prediction": predictions,
        "agence": agence.name,
        "image_path": saved_image_path2,
        "image_annoter_path": saved_image_path2
    })