from flask import Flask, request, jsonify
from PIL import Image
import cv2
import numpy as np
import torch
import base64
import io
from torchvision import transforms
from ultralytics import YOLO



# === Configuration ===
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# === Charger les modèles ===
model_yolo = YOLO('app/DL_models/best.pt')
model_resnet = torch.load('app/DL_models/model_rresnet.pt', map_location=device)
model_resnet.eval().to(device)

# === Classes utilisées par ResNet ===
class_names = ['cracks', 'good_road', 'open_manhole', 'pothole']

# === Transformations pour ResNet ===
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# === Fonction de prédiction ===
def detect_and_classify(image: np.ndarray):
    results = model_yolo(image)
    boxes = results[0].boxes

    predictions = []
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    for box in boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])

        cropped = image_rgb[y1:y2, x1:x2]
        if cropped.size == 0:
            continue

        cropped_pil = Image.fromarray(cropped)
        input_tensor = transform(cropped_pil).unsqueeze(0).to(device)

        with torch.no_grad():
            output = model_resnet(input_tensor)
            predicted_class = output.argmax(dim=1).item()

        predictions.append({
            "class": class_names[predicted_class],
            "box": [x1, y1, x2, y2]
        })

    return predictions

def detect_and_classify2(image: np.ndarray):
    results = model_yolo(image)
    boxes = results[0].boxes

    image_bgr = image.copy()
    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)

    predictions = []

    for box in boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])

        cropped = image_rgb[y1:y2, x1:x2]
        if cropped.size == 0:
            continue

        cropped_pil = Image.fromarray(cropped)
        input_tensor = transform(cropped_pil).unsqueeze(0).to(device)

        with torch.no_grad():
            output = model_resnet(input_tensor)
            predicted_class = output.argmax(dim=1).item()

        label = class_names[predicted_class]

        predictions.append({
            "class": label,
            "box": [x1, y1, x2, y2]
        })

        # Dessiner la boîte et le label
        cv2.rectangle(image_bgr, (x1, y1), (x2, y2), (0, 255, 0), 2)
        (text_w, text_h), baseline = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
        cv2.rectangle(image_bgr, (x1, y1), (x1 + text_w, y1 + text_h + baseline), (0, 255, 0), -1)
        cv2.putText(image_bgr, label, (x1, y1 + text_h), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)

    # Encoder l’image annotée en PNG puis en base64
    _, buffer = cv2.imencode('.png', image_bgr)
    img_base64 = base64.b64encode(buffer).decode('utf-8')

    return predictions, img_base64


