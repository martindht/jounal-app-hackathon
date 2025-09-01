// src/lib/nlp.js
import vader from "vader-sentiment";

/** Returns compound sentiment in range of [-1, 1] (negative -> positive). */
export function sentimentCompound(text = "") {
  const s = String(text || "");
  const vs = vader.SentimentIntensityAnalyzer.polarity_scores(s);
  return Number.isFinite(vs?.compound) ? vs.compound : 0;
}

/** Map  score within a range for suggestions. */
export function sentimentBand(score) {
  if (score <= -0.25) return "sad";
  if (score >= 0.25) return "happy";
  return "neutral";
}
