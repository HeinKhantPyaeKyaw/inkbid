import PyPDF2

def extract_text_from_pdf(filepath: str) -> str:
  """Extract text from .PDF file and return as string"""
  text = ""
  with open(filepath, "rb") as f:
    reader = PyPDF2.PdfReader(f)
    for page in reader.pages:
      text += page.extract_text() or ""
  return text
