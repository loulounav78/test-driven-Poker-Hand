import { rankValue, sortCardsDesc } from "./cards";
import { Card, EvaluatedHand, HandCategory } from "./types";
import { buildRankGroups, getStraightInfo } from "./utils";

export function evaluate5(cards: Card[]): EvaluatedHand {
  const sortedDesc = sortCardsDesc(cards);
  const groups = buildRankGroups(cards);
  const pairs = groups.filter((g) => g.count === 2);
  const trips = groups.filter((g) => g.count === 3);
  const straight = getStraightInfo(cards);

  if (straight.isStraight) {
    return {
      category: HandCategory.Straight,
      categoryName: "Straight",
      chosen5: straight.orderedCards,
      tiebreak: [straight.highCard],
    };
  }

  if (trips.length === 1) {
    const tripRank = trips[0].rankValue;
    const tripCards = sortedDesc.filter((c) => rankValue(c) === tripRank);
    const kickers = sortedDesc.filter((c) => rankValue(c) !== tripRank);

    return {
      category: HandCategory.ThreeOfAKind,
      categoryName: "Three of a kind",
      chosen5: [...tripCards, ...kickers],
      tiebreak: [tripRank, ...kickers.map(rankValue)],
    };
  }

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