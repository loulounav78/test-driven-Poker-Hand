import { Card } from "./types";
import { formatCard, rankValue, sortCardsDesc } from "./cards";

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

export function isConsecutiveDesc(values: number[]): boolean {
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] - 1 !== values[i + 1]) return false;
  }
  return true;
}

export function getStraightInfo(cards: Card[]): {
  isStraight: boolean;
  highCard: number;
  orderedCards: Card[];
} {
  const byRank = new Map<number, Card>();

  for (const card of sortCardsDesc(cards)) {
    const v = rankValue(card);
    if (!byRank.has(v)) {
      byRank.set(v, card);
    }
  }

  const uniqueRanksDesc = Array.from(byRank.keys()).sort((a, b) => b - a);

  const wheel = [14, 5, 4, 3, 2];
  if (wheel.every((r) => byRank.has(r))) {
    return {
      isStraight: true,
      highCard: 5,
      orderedCards: [
        byRank.get(5)!,
        byRank.get(4)!,
        byRank.get(3)!,
        byRank.get(2)!,
        byRank.get(14)!,
      ],
    };
  }

  for (let i = 0; i <= uniqueRanksDesc.length - 5; i++) {
    const slice = uniqueRanksDesc.slice(i, i + 5);
    if (isConsecutiveDesc(slice)) {
      return {
        isStraight: true,
        highCard: slice[0],
        orderedCards: slice.map((r) => byRank.get(r)!),
      };
    }
  }

  return {
    isStraight: false,
    highCard: 0,
    orderedCards: [],
  };
}