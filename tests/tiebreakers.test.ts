import { describe, expect, it } from "vitest";
import { parseCard } from "../src/cards";
import { evaluateBestHand } from "../src/bestHand";
import { compareEvaluatedHands } from "../src/compare";
import { HandCategory } from "../src/types";

function c(input: string) {
  return parseCard(input);
}

describe("tie breakers", () => {
  it("compares straights by highest card", () => {
    const p1 = evaluateBestHand([
      c("TC"), c("JD"), c("QH"), c("KS"), c("2D"), c("AC"), c("3D"),
    ]);
    const p2 = evaluateBestHand([
      c("9C"), c("TD"), c("JH"), c("QS"), c("2C"), c("KC"), c("3S"),
    ]);

    expect(p1.category).toBe(HandCategory.Straight);
    expect(p2.category).toBe(HandCategory.Straight);
    expect(compareEvaluatedHands(p1, p2)).toBeGreaterThan(0);
  });

  it("compares straight flushes by highest card", () => {
    const p1 = evaluateBestHand([
      c("9H"), c("TH"), c("JH"), c("QH"), c("KH"), c("2C"), c("3D"),
    ]);
    const p2 = evaluateBestHand([
      c("8S"), c("9S"), c("TS"), c("JS"), c("QS"), c("2D"), c("3C"),
    ]);

    expect(p1.category).toBe(HandCategory.StraightFlush);
    expect(p2.category).toBe(HandCategory.StraightFlush);
    expect(compareEvaluatedHands(p1, p2)).toBeGreaterThan(0);
  });

  it("compares four of a kind using kicker when quads are equal", () => {
    const p1 = evaluateBestHand([
      c("7C"), c("7D"), c("7H"), c("7S"), c("AC"), c("2D"), c("3H"),
    ]);
    const p2 = evaluateBestHand([
      c("7C"), c("7D"), c("7H"), c("7S"), c("QC"), c("2H"), c("3D"),
    ]);

    expect(compareEvaluatedHands(p1, p2)).toBeGreaterThan(0);
  });

  it("compares full houses by trips first", () => {
    const p1 = evaluateBestHand([
      c("KC"), c("KD"), c("KH"), c("2S"), c("2D"), c("3C"), c("4H"),
    ]);
    const p2 = evaluateBestHand([
      c("QC"), c("QD"), c("QH"), c("AS"), c("AD"), c("3D"), c("4C"),
    ]);

    expect(p1.category).toBe(HandCategory.FullHouse);
    expect(p2.category).toBe(HandCategory.FullHouse);
    expect(compareEvaluatedHands(p1, p2)).toBeGreaterThan(0);
  });

  it("compares full houses by pair when trips are equal", () => {
    const p1 = evaluateBestHand([
      c("KC"), c("KD"), c("KH"), c("QS"), c("QD"), c("2C"), c("3H"),
    ]);
    const p2 = evaluateBestHand([
      c("KC"), c("KD"), c("KH"), c("JS"), c("JD"), c("2D"), c("3C"),
    ]);

    expect(compareEvaluatedHands(p1, p2)).toBeGreaterThan(0);
  });

  it("compares flushes card by card", () => {
    const p1 = evaluateBestHand([
      c("AH"), c("JH"), c("9H"), c("6H"), c("4H"), c("2C"), c("3D"),
    ]);
    const p2 = evaluateBestHand([
      c("AH"), c("JH"), c("8H"), c("7H"), c("4H"), c("2D"), c("3C"),
    ]);

    expect(p1.category).toBe(HandCategory.Flush);
    expect(p2.category).toBe(HandCategory.Flush);
    expect(compareEvaluatedHands(p1, p2)).toBeGreaterThan(0);
  });

  it("compares three of a kind with kickers", () => {
    const p1 = evaluateBestHand([
      c("9C"), c("9D"), c("9H"), c("AS"), c("KD"), c("2C"), c("3H"),
    ]);
    const p2 = evaluateBestHand([
      c("9S"), c("9H"), c("9D"), c("AS"), c("QD"), c("2D"), c("3C"),
    ]);

    expect(compareEvaluatedHands(p1, p2)).toBeGreaterThan(0);
  });

  it("compares two pair by higher pair, then lower pair, then kicker", () => {
    const p1 = evaluateBestHand([
      c("AH"), c("AD"), c("KC"), c("KD"), c("4S"), c("2C"), c("3D"),
    ]);
    const p2 = evaluateBestHand([
      c("AH"), c("AD"), c("QC"), c("QD"), c("KS"), c("2D"), c("3C"),
    ]);

    expect(compareEvaluatedHands(p1, p2)).toBeGreaterThan(0);
  });

  it("compares one pair with kickers", () => {
    const p1 = evaluateBestHand([
      c("AH"), c("AD"), c("KC"), c("QD"), c("JS"), c("3C"), c("2D"),
    ]);
    const p2 = evaluateBestHand([
      c("AS"), c("AC"), c("KC"), c("QD"), c("TS"), c("3H"), c("2S"),
    ]);

    expect(compareEvaluatedHands(p1, p2)).toBeGreaterThan(0);
  });

  it("compares high card hands card by card", () => {
    const p1 = evaluateBestHand([
      c("AC"), c("KD"), c("9H"), c("7S"), c("4D"), c("2C"), c("3H"),
    ]);
    const p2 = evaluateBestHand([
      c("AC"), c("KD"), c("8H"), c("7D"), c("4S"), c("2H"), c("3C"),
    ]);

    expect(p1.category).toBe(HandCategory.HighCard);
    expect(p2.category).toBe(HandCategory.HighCard);
    expect(compareEvaluatedHands(p1, p2)).toBeGreaterThan(0);
  });

  it("does not allow wrap-around straight Q-K-A-2-3", () => {
    const hand = evaluateBestHand([
      c("QC"), c("KD"), c("AH"), c("2S"), c("3D"), c("9C"), c("8H"),
    ]);

    expect(hand.category).not.toBe(HandCategory.Straight);
  });
});