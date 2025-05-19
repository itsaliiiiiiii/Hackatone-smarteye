from flask import Flask,request,jsonify
import cv2
import numpy as np 
from flask_cors import CORS 
from app.Services.DL import detect_and_classify,detect_and_classify2
app=Flask(__name__)
CORS(app)

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

@app.route('/')
def say_Hellow():
    return 'hi'

if __name__=='__main__':
    app.run(debug=True)
