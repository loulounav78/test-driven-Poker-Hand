import { compareEvaluatedHands } from "./compare";
import { evaluate5 } from "./evaluator5";
import { Card, EvaluatedHand } from "./types";
import { choose5, validateNoDuplicateCards } from "./utils";

export function evaluateBestHand(cards: Card[]): EvaluatedHand {
  if (cards.length !== 7) {
    throw new Error(`evaluateBestHand expects 7 cards, got ${cards.length}`);
  }

  validateNoDuplicateCards(cards);

  const combos = choose5(cards);
  let best = evaluate5(combos[0]);

  for (const combo of combos.slice(1)) {
    const current = evaluate5(combo);
    if (compareEvaluatedHands(current, best) > 0) {
      best = current;
    }
  }

  return best;
}