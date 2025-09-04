import pytest
from services.preprocess_text import preprocess_text

def test_preprocess_text_basic():
    raw = "Hello   \nWorld 123\n\n!"
    cleaned = preprocess_text(raw, lowercase=True, remove_punctuation=True)

    # Basic checks
    assert "hello world" in cleaned      # whitespace + newlines collapsed
    assert "123" not in cleaned          # numbers removed
    assert "!" not in cleaned            # punctuation removed

def test_preprocess_text_keep_case():
    raw = "Hello World"
    cleaned = preprocess_text(raw, lowercase=False)

    # Should keep original case
    assert "Hello World" in cleaned
    assert "hello world" not in cleaned

def test_preprocess_text_encoding():
    raw = "This is a test\xa0string with weird space"
    cleaned = preprocess_text(raw)

    # Should normalize encoding and remove \xa0
    assert "\xa0" not in cleaned
    assert "test string" in cleaned
