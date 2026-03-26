import { describe, expect, it } from "vitest";
import { parseCard, formatCard } from "../src/cards";
import { evaluateBestHand } from "../src/bestHand";
import { HandCategory } from "../src/types";

function c(input: string) {
  return parseCard(input);
}

function s(cards: ReturnType<typeof parseCard>[]) {
  return cards.map(formatCard);
}

describe("category detection", () => {
  it("detects high card", () => {
    const hand = evaluateBestHand([
      c("AC"), c("KD"), c("8H"), c("6S"), c("4D"), c("3C"), c("2H"),
    ]);

    expect(hand.category).toBe(HandCategory.HighCard);
    expect(s(hand.chosen5)).toEqual(["AC", "KD", "8H", "6S", "4D"]);
  });
  it("detects one pair", () => {
    const hand = evaluateBestHand([
      c("AC"), c("AD"), c("KH"), c("QS"), c("9D"), c("3C"), c("2H"),
    ]);

    expect(hand.category).toBe(HandCategory.OnePair);
    expect(s(hand.chosen5)).toEqual(["AD", "AC", "KH", "QS", "9D"]);
  });

  it("detects two pair", () => {
    const hand = evaluateBestHand([
      c("AC"), c("AD"), c("KH"), c("KS"), c("9D"), c("3C"), c("2H"),
    ]);

    expect(hand.category).toBe(HandCategory.TwoPair);
    expect(s(hand.chosen5)).toEqual(["AD", "AC", "KS", "KH", "9D"]);
  });
  it("detects three of a kind", () => {
    const hand = evaluateBestHand([
      c("9C"), c("9D"), c("9H"), c("AS"), c("KD"), c("3C"), c("2H"),
    ]);

    expect(hand.category).toBe(HandCategory.ThreeOfAKind);
    expect(s(hand.chosen5)).toEqual(["9H", "9D", "9C", "AS", "KD"]);
  });

  it("detects ace-low straight (wheel)", () => {
    const hand = evaluateBestHand([
      c("AC"), c("2D"), c("3H"), c("4S"), c("9D"), c("5C"), c("KD"),
    ]);

    expect(hand.category).toBe(HandCategory.Straight);
    expect(s(hand.chosen5)).toEqual(["5C", "4S", "3H", "2D", "AC"]);
    expect(hand.tiebreak).toEqual([5]);
  });

  it("detects ace-high straight", () => {
    const hand = evaluateBestHand([
      c("TC"), c("JD"), c("QH"), c("KS"), c("2D"), c("AC"), c("3D"),
    ]);

    expect(hand.category).toBe(HandCategory.Straight);
    expect(s(hand.chosen5)).toEqual(["AC", "KS", "QH", "JD", "TC"]);
    expect(hand.tiebreak).toEqual([14]);
  });
  it("detects flush", () => {
    const hand = evaluateBestHand([
      c("AH"), c("JH"), c("9H"), c("4H"), c("2C"), c("6H"), c("KD"),
    ]);

    expect(hand.category).toBe(HandCategory.Flush);
    expect(s(hand.chosen5)).toEqual(["AH", "JH", "9H", "6H", "4H"]);
  });

  it("detects full house", () => {
    const hand = evaluateBestHand([
      c("6S"), c("6H"), c("6D"), c("KC"), c("KH"), c("2S"), c("3D"),
    ]);

    expect(hand.category).toBe(HandCategory.FullHouse);
    expect(s(hand.chosen5)).toEqual(["6S", "6H", "6D", "KH", "KC"]);
    expect(hand.tiebreak).toEqual([6, 13]);
  });

  it("detects four of a kind", () => {
    const hand = evaluateBestHand([
      c("7C"), c("7D"), c("7H"), c("7S"), c("AD"), c("2C"), c("3H"),
    ]);

    expect(hand.category).toBe(HandCategory.FourOfAKind);
    expect(s(hand.chosen5)).toEqual(["7S", "7H", "7D", "7C", "AD"]);
    expect(hand.tiebreak).toEqual([7, 14]);
  });

  it("detects straight flush", () => {
    const hand = evaluateBestHand([
      c("QH"), c("JH"), c("TH"), c("9H"), c("8H"), c("2C"), c("3D"),
    ]);

    expect(hand.category).toBe(HandCategory.StraightFlush);
    expect(s(hand.chosen5)).toEqual(["QH", "JH", "TH", "9H", "8H"]);
    expect(hand.tiebreak).toEqual([12]);
  });
});