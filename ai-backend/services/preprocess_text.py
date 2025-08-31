import re
import string

def preprocess_text(text: str, lowercase: bool=False, remove_punctuation: bool = False, normalize_encoding: bool = True) -> str:
  """
    Clean and normalize extracted text from PDF for AI model input.

    Steps:
    - Remove extra newlines
    - Remove multiple spaces
    - Remove page numbers or short lines
    - Convert to lowercase (optional, depends on model)
    - Strip invalid characters (normalize encoding)
    """

  if normalize_encoding:
    text = text.encode("utf-8", "ignore").decode("utf-8")

  # Remove line breaks and replace with space
  text = re.sub(r'\n+', ' ', text)

  # Replace multiple spaces with a single space
  text = re.sub(r'\s+', ' ', text)

  # Remove standalone numbers (like page numbers)
  text = re.sub(r'\b\d+\b', '', text)

  # Optional according to the ai model : remove punctuation
  if remove_punctuation:
    text = text.translate(str.maketrans("", "", string.punctuation))

  # Optional according to the ai model: convert to lowercase (can disable if the models are case-sensitive)
  if lowercase:
    text = text.lower()

  text = text.strip()

  return text
