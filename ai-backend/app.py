from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import numpy as np
import cv2
from app.Services.DL import detect_and_classify, detect_and_classify2
from app.models import db
from app.Services.Report import *
from app.Services.authentication import *
import base64
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:5173", "http://localhost:3001"], "supports_credentials": True, "allow_headers": ["Content-Type", "Authorization", "Content-Length", "X-Requested-With"], "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}})

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:12345678@localhost/urban_issues'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

# === Endpoint Flask ===
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files['image']
    img_bytes = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(img_bytes, cv2.IMREAD_COLOR)

    results = detect_and_classify(image)
    return jsonify({"predictions": results})


@app.route('/predictt', methods=['POST'])
def predict2():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files['image']
    img_bytes = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(img_bytes, cv2.IMREAD_COLOR)

    predictions, img_base64 = detect_and_classify2(image)

    return jsonify({
        "predictions": predictions,
        "image_annotated": img_base64  # Image annotée encodée en base64
    })

@app.route('/register',methods=['POST'])
def Register():
    data = request.get_json()

    fullName = data.get('fullName')
    phoneNumber = data.get('phoneNumber')
    password = data.get('password')
    cin = data.get('cin')

    city_name = data.get('city')

    if not all([fullName, phoneNumber, password, cin, city_name]):
        return jsonify({'error': 'Missing required fields'}), 400

    result = register_user(fullName, phoneNumber, password, cin, city_name)
    return result

@app.route('/login',methods=['POST'])
def login_user():
    data = request.get_json()

    phoneNumber = data.get('phoneNumber')
    password = data.get('password')


    if not all([phoneNumber, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    result = login(phoneNumber, password)
    return result



@app.route('/ville',methods=['POST'])
def say_Hellow():

    data =request.get_json()
    x=data.get('x')
    y=data.get('y')
    result = get_city_from_coordinates(x,y)
    
    return result

@app.route('/reports', methods=['POST'])
def create_report():
    # Récupérer les champs texte depuis form-data
    description = request.form.get('problemType')
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files['image']
    img_bytes = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(img_bytes, cv2.IMREAD_COLOR)

    location_raw = request.form.get('location')
    location_dict = json.loads(location_raw)  # transforme la chaîne JSON en dict

    x = int(location_dict['x'])
    y = int(location_dict['y'])

    # Lire le contenu binaire de l'image
    image_bytes = image.read()

    # Encoder en base64
    image_initial64 = base64.b64encode(image_bytes).decode('utf-8')

    result = get_Result(image,description,x,y,image_initial64)

    return jsonify({"result":result})


if __name__=='__main__':
    app.run(debug=True)
