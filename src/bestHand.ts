import { Card, EvaluatedHand, HandCategory } from "./types";

const RANK_VALUE: Record<string, number> = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

function sortCardsDesc(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => RANK_VALUE[b.rank] - RANK_VALUE[a.rank]);
}

export function evaluateBestHand(cards: Card[]): EvaluatedHand {
  if (cards.length !== 7) {
    throw new Error(`evaluateBestHand expects 7 cards, got ${cards.length}`);
  }

  const chosen5 = sortCardsDesc(cards).slice(0, 5);

  return {
    category: HandCategory.HighCard,
    categoryName: "High card",
    chosen5,
    tiebreak: chosen5.map((c) => RANK_VALUE[c.rank]),
  };
}