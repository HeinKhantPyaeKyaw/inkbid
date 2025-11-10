import re
import string

def preprocess_text(text: str, lowercase: bool=False, remove_punctuation: bool = False, normalize_encoding: bool = True) -> str:


  if normalize_encoding:
    text = text.encode("utf-8", "ignore").decode("utf-8")

  text = re.sub(r'\n+', ' ', text)

  text = re.sub(r'\s+', ' ', text)

  text = re.sub(r'\b\d+\b', '', text)

  if remove_punctuation:
    text = text.translate(str.maketrans("", "", string.punctuation))

  if lowercase:
    text = text.lower()

  text = text.strip()

  return text
