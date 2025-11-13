import re
from typing import Any

def normalize_vicuna(raw_result: Any) -> dict:
    """
    Convert Vicuna HF output into {ai_score, human_score}.
    - If Vicuna only returns one score, infer the other by 1 - score.
    - Confirmed: value close to 1 = AI, value close to 0 = Human.
    """
    if isinstance(raw_result, dict) and "error" in raw_result:
        return {"ai_score": None, "human_score": None, "error": raw_result["error"]}

    if isinstance(raw_result, list) and len(raw_result) > 0:
        item = raw_result[0]
        label = item["label"]
        score = item["score"]

        if label == "LABEL_0":
            return {"ai_score": score, "human_score": 1 - score}
        elif label == "LABEL_1":
            return {"ai_score": 1 - score, "human_score": score}
        else:
            return {"ai_score": None, "human_score": None, "error": f"Unexpected label {label}"}

    return {"ai_score": None, "human_score": None, "error": "Invalid Vicuna output format"}

def normalize_szegedai(raw_result: dict) -> dict:
    """
    Convert SzegedAI HTML-like result into {ai_score, human_score}.
    """
    result_raw = raw_result.get("result", "")

    if isinstance(result_raw, tuple):
        result_str = " ".join(str(item) for item in result_raw if item)
    else:
        result_str = str(result_raw)

    match = re.search(r"(\d+\.?\d*)%", result_str)
    if not match:
        return {"ai_score": None, "human_score": None, "error": "Could not parse SzegedAI output"}

    score = float(match.group(1)) / 100.0

    if "Human" in result_str:
        return {"human_score": score, "ai_score": 1 - score}
    elif "AI" in result_str:
        return {"ai_score": score, "human_score": 1 - score}
    else:
        return {"ai_score": None, "human_score": None, "error": "Unknown label in SzegedAI output"}

