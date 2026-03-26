import { Card, Rank, Suit } from "./types";

export const RANK_VALUE: Record<Rank, number> = {
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

export function parseCard(input: string): Card {
  if (!/^[2-9TJQKA][CDHS]$/.test(input)) {
    throw new Error(`Invalid card: ${input}`);
  }

  return {
    rank: input[0] as Rank,
    suit: input[1] as Suit,
  };
}

export function formatCard(card: Card): string {
  return `${card.rank}${card.suit}`;
}

export function rankValue(card: Card): number {
  return RANK_VALUE[card.rank];
}

export function suitOrder(suit: Suit): number {
  return { S: 0, H: 1, D: 2, C: 3 }[suit];
}

export function sortCardsDesc(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => {
    const diff = rankValue(b) - rankValue(a);
    if (diff !== 0) return diff;
    return suitOrder(a.suit) - suitOrder(b.suit);
  });
}