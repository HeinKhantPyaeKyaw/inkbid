def ensemble_results(vicuna_result: dict, szegedAI_result: dict, threshold: float = 0.40) -> dict:
  # Extract scores safely(fallback to 0.0 if missing)
  vicuna_ai = vicuna_result.get("ai_score") or 0.0
  vicuna_human = vicuna_result.get("human_score") or 0.0
  szegedAI_ai = szegedAI_result.get("ai_score") or 0.0
  szegedAI_human = szegedAI_result.get("human_score") or 0.0

  # Average scores (soft voting ensemble)
  final_ai = (vicuna_ai + szegedAI_ai) / 2
  final_human = (vicuna_human + szegedAI_human) / 2

  # Apply decision threshold
  eligible = final_ai <= threshold

  return {
    "ai_score": round(final_ai, 3),
    "human_score": round(final_human, 3),
    "eligible": eligible
  }
