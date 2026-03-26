import { evaluate5 } from "./evaluator5";
import { Card, EvaluatedHand } from "./types";
import { choose5, validateNoDuplicateCards } from "./utils";

function compareTiebreak(a: number[], b: number[]): number {
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    if (av !== bv) return av - bv;
  }
  return 0;
}

export function evaluateBestHand(cards: Card[]): EvaluatedHand {
  if (cards.length !== 7) {
    throw new Error(`evaluateBestHand expects 7 cards, got ${cards.length}`);
  }

  validateNoDuplicateCards(cards);

  const combos = choose5(cards);
  let best = evaluate5(combos[0]);

  for (const combo of combos.slice(1)) {
    const current = evaluate5(combo);
    if (
      current.category > best.category ||
      (current.category === best.category &&
        compareTiebreak(current.tiebreak, best.tiebreak) > 0)
    ) {
      best = current;
    }
  }

  return best;
}