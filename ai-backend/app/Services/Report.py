import requests
from flask import jsonify
import re
from .DL import *
from app.models import *

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



def get_Result(img,desc,x,y,i):

    ville=get_city_from_coordinates(x,y)

    predictions, img_base64 = detect_and_classify2(img)

    city = City.query.filter_by(name=ville).first()
    if not city:
        return jsonify({"error":"{ville} not found in db"}),404

    
    agence = Agency.query.filter_by(problem_types=predictions[0]['class'],CityId=city.id)
    if not city:
        return jsonify({"error":"agence not found in db"}),404

    
    new_report = Report(

        problemType=predictions,
        image=i , # Stockées sous forme de liste -> JSON
        status='pending',
        priority='high',
        image_annoter=img_base64,
        UserId=1,
        CityId=city.id,
        AgencyId=agence.id
    )

    db.session.add(new_report)
    db.session.commit()

    return jsonify({"image":img_base64,"prediction":predictions,"agence":agence})