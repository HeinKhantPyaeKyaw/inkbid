import os
from flask import Flask, jsonify, request
from services.pdf_handler import extract_text_from_pdf
from services.preprocess_text import preprocess_text
from services.models import load_vicuna, query_vicuna, query_szegedai
from services.normalize_results import normalize_vicuna, normalize_szegedai
from services.ensemble import ensemble_results
from flask_cors import CORS

# Create Flask app
app = Flask(__name__)
# CORS(app)
CORS(app, origins=["https://inkbid.store","http://ec2-54-252-208-51.ap-southeast-2.compute.amazonaws.com:3000", "http://localhost:3000", "http://127.0.0.1:3000"])

# Configure upload folder
UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load Vicuna Model
load_vicuna()

# Home Route
@app.route("/", methods = ["GET"])
def home():
  return jsonify({"message": "Welcome to the AI Detection Backend 🚀"})

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    # Save uploaded file
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], str(file.filename))
    file.save(filepath)

    # Extract text using pdf_handler service
    try:
       text = extract_text_from_pdf(filepath)
    except Exception as e:
       return jsonify({"error": f"Failed to read PDF: {str(e)}"}), 500

    # Preprocess and clean text from raw text of original file
    clean_text = preprocess_text(text, lowercase=False, remove_punctuation=False, normalize_encoding=True)

    # Run both models
    vicuna_raw = query_vicuna(clean_text)
    szegedAI_raw = query_szegedai(clean_text)

    # Normalize Result
    vicuna_result = normalize_vicuna(vicuna_raw)
    szegedAI_result = normalize_szegedai(szegedAI_raw)

    # Ensemble + Decision
    final_result = ensemble_results(vicuna_result, szegedAI_result)

    # Final clean response
    response = {
       "filename": file.filename,
       "scores": {
          "ai": final_result["ai_score"],
          "human": final_result["human_score"],
       },
       "eligible": final_result["eligible"]
    }

    return jsonify(response), 200

if(__name__ == "__main__"):
  app.run(host='0.0.0.0', debug=True, port=5050)
