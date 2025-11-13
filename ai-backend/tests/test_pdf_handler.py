import os
from services.pdf_handler import extract_text_from_pdf

def test_extract_text_from_pdf():
    # Use your sample file
    sample_pdf = os.path.join("uploads", "cnn_business_001.pdf")

    # Ensure file exists
    assert os.path.exists(sample_pdf), "Sample PDF not found in uploads/"

    # Extract text
    text = extract_text_from_pdf(sample_pdf)

    # Check text is not empty
    assert text.strip() != "", "Extracted text is empty"

    # Check known keyword appears
    assert "Skechers" in text, "Expected word not found in extracted text"
