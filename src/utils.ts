import { Card } from "./types";
import { formatCard, rankValue } from "./cards";

export function validateNoDuplicateCards(...groups: Card[][]): void {
  const seen = new Set<string>();

  for (const group of groups) {
    for (const card of group) {
      const key = formatCard(card);
      if (seen.has(key)) {
        throw new Error(`Duplicate card detected: ${key}`);
      }
      seen.add(key);
    }
  }
}

export function choose5(cards: Card[]): Card[][] {
  const result: Card[][] = [];

  for (let a = 0; a < cards.length - 4; a++) {
    for (let b = a + 1; b < cards.length - 3; b++) {
      for (let c = b + 1; c < cards.length - 2; c++) {
        for (let d = c + 1; d < cards.length - 1; d++) {
          for (let e = d + 1; e < cards.length; e++) {
            result.push([cards[a], cards[b], cards[c], cards[d], cards[e]]);
          }
        }
      }
    }
  }

  return result;
}

export function buildRankGroups(cards: Card[]): Array<{ rankValue: number; count: number }> {
  const counts = new Map<number, number>();

  for (const card of cards) {
    const v = rankValue(card);
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([rankValue, count]) => ({ rankValue, count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return b.rankValue - a.rankValue;
    });
}