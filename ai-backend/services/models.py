import os
import requests
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from gradio_client import Client
from dotenv import load_dotenv

#  --------- Vicuna-7B Radar(Inference API) ----------

def load_vicuna(model_id: str = "TrustSafeAI/RADAR-Vicuna-7B"):
  global vicuna_model
  try:
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    model = AutoModelForSequenceClassification.from_pretrained(model_id)
    vicuna_model = pipeline("text-classification", model=model, tokenizer=tokenizer)
    print(f"Vicuna loaded locally: {model_id}")
  except Exception as e:
    print(f"Failed to load Vicuna: {e}")

def query_vicuna(text: str):
  if not vicuna_model:
    return {"error": "Vicuna is not loaded"}
  try:
    return vicuna_model(text, truncation=True, max_length=512)
  except Exception as e:
    return {"error": f"Vicuna inference failed: {str(e)}"}

# ---------- Szeged AI_Detector (via Gradio API) ----------
def query_szegedai(text: str):
  try:
    client = Client("SzegedAI/AI_Detector")
    result = client.predict(
		text=text,
		api_name="/classify_text"
    )
    return {"result": result}
  except Exception as e:
    return {"error": f"SzegedAI request failed: {str(e)}"}
