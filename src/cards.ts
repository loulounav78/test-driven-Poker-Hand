import { Card, Rank, Suit } from "./types";

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