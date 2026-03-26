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
});