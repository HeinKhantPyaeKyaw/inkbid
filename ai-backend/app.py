from flask import Flask, jsonify

# Create Flask app
app = Flask(__name__)

# Home Route
@app.route("/", methods = ["GET"])
def home():
  return jsonify({"message": "Welcome to the AI Detection Backend 🚀"})

if(__name__ == "__main__"):
  app.run(debug=True, port=5000)
