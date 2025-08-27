import os
from flask import Flask, jsonify, request
from services.pdf_handler import extract_text_from_pdf
from services.preprocess_text import preprocess_text

# Create Flask app
app = Flask(__name__)

# Configure upload folder
UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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

    return jsonify({
        "message": "File uploaded successfully ✅",
        "filename": file.filename,
        "text-preview": clean_text[:500]
    }), 200

if(__name__ == "__main__"):
  app.run(debug=True, port=5000)
