import { rankValue, sortCardsDesc } from "./cards";
import { Card, EvaluatedHand, HandCategory } from "./types";
import { buildRankGroups } from "./utils";

export function evaluate5(cards: Card[]): EvaluatedHand {
  const sortedDesc = sortCardsDesc(cards);
  const groups = buildRankGroups(cards);
  const pairs = groups.filter((g) => g.count === 2);

  if (pairs.length === 2) {
    const highPair = pairs[0].rankValue;
    const lowPair = pairs[1].rankValue;
    const highPairCards = sortedDesc.filter((c) => rankValue(c) === highPair);
    const lowPairCards = sortedDesc.filter((c) => rankValue(c) === lowPair);
    const kicker = sortedDesc.find(
      (c) => rankValue(c) !== highPair && rankValue(c) !== lowPair,
    )!;

    return {
      category: HandCategory.TwoPair,
      categoryName: "Two pair",
      chosen5: [...highPairCards, ...lowPairCards, kicker],
      tiebreak: [highPair, lowPair, rankValue(kicker)],
    };
  }

  if (pairs.length === 1) {
    const pairRank = pairs[0].rankValue;
    const pairCards = sortedDesc.filter((c) => rankValue(c) === pairRank);
    const kickers = sortedDesc.filter((c) => rankValue(c) !== pairRank);

    return {
      category: HandCategory.OnePair,
      categoryName: "One pair",
      chosen5: [...pairCards, ...kickers],
      tiebreak: [pairRank, ...kickers.map(rankValue)],
    };
  }

  return {
    category: HandCategory.HighCard,
    categoryName: "High card",
    chosen5: sortedDesc,
    tiebreak: sortedDesc.map(rankValue),
  };
}