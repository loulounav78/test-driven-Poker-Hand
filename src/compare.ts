import { EvaluatedHand } from "./types";

export function compareEvaluatedHands(a: EvaluatedHand, b: EvaluatedHand): number {
  if (a.category !== b.category) {
    return a.category - b.category;
  }

  const len = Math.max(a.tiebreak.length, b.tiebreak.length);

  for (let i = 0; i < len; i++) {
    const av = a.tiebreak[i] ?? 0;
    const bv = b.tiebreak[i] ?? 0;
    if (av !== bv) return av - bv;
  }

  return 0;
}