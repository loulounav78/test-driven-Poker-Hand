import { describe, expect, it } from "vitest";
import { parseCard, formatCard } from "../src/cards";
import { evaluateBestHand } from "../src/bestHand";
import { comparePlayers } from "../src/holdem";
import { HandCategory } from "../src/types";

function c(input: string) {
  return parseCard(input);
}

function s(cards: ReturnType<typeof parseCard>[]) {
  return cards.map(formatCard);
}

describe("holdem / best-of-7", () => {
  it("supports board plays and split pot", () => {
    const result = comparePlayers(
      [c("5C"), c("6D"), c("7H"), c("8S"), c("9D")],
      [
        { id: "p1", hole: [c("AC"), c("AD")] },
        { id: "p2", hole: [c("KC"), c("QD")] },
      ],
    );

    expect(result.winners.map((w) => w.id)).toEqual(["p1", "p2"]);
    expect(s(result.players[0].best.chosen5)).toEqual(["9D", "8S", "7H", "6D", "5C"]);
    expect(s(result.players[1].best.chosen5)).toEqual(["9D", "8S", "7H", "6D", "5C"]);
  });

  it("quads on board: kicker decides", () => {
    const result = comparePlayers(
      [c("7C"), c("7D"), c("7H"), c("7S"), c("2D")],
      [
        { id: "p1", hole: [c("AC"), c("KC")] },
        { id: "p2", hole: [c("QC"), c("JC")] },
      ],
    );

    expect(result.winners.map((w) => w.id)).toEqual(["p1"]);
    expect(s(result.players[0].best.chosen5)).toEqual(["7S", "7H", "7D", "7C", "AC"]);
    expect(s(result.players[1].best.chosen5)).toEqual(["7S", "7H", "7D", "7C", "QC"]);
  });

  it("can build the best hand using both hole cards", () => {
    const hand = evaluateBestHand([
      c("AC"), c("KD"), c("QS"), c("JH"), c("2D"), c("TC"), c("9C"),
    ]);

    expect(hand.category).toBe(HandCategory.Straight);
    expect(s(hand.chosen5)).toEqual(["AC", "KD", "QS", "JH", "TC"]);
  });

  it("can build the best hand using exactly one hole card", () => {
    const hand = evaluateBestHand([
      c("AH"), c("KH"), c("QH"), c("2H"), c("3D"), c("JH"), c("4S"),
    ]);

    expect(hand.category).toBe(HandCategory.Flush);
    expect(s(hand.chosen5)).toEqual(["AH", "KH", "QH", "JH", "2H"]);
  });

  it("can build the best hand using zero hole card (board plays)", () => {
    const hand = evaluateBestHand([
      c("5C"), c("6D"), c("7H"), c("8S"), c("9D"), c("AC"), c("KD"),
    ]);

    expect(hand.category).toBe(HandCategory.Straight);
    expect(s(hand.chosen5)).toEqual(["9D", "8S", "7H", "6D", "5C"]);
  });

  it("selects the best flush when more than 5 suited cards are available", () => {
    const hand = evaluateBestHand([
      c("AH"), c("JH"), c("9H"), c("4H"), c("2C"), c("6H"), c("3H"),
    ]);

    expect(hand.category).toBe(HandCategory.Flush);
    expect(s(hand.chosen5)).toEqual(["AH", "JH", "9H", "6H", "4H"]);
  });

  it("selects the best full house when two triplets are available across 7 cards", () => {
    const hand = evaluateBestHand([
      c("AC"), c("AD"), c("AH"), c("KC"), c("KD"), c("KH"), c("2S"),
    ]);

    expect(hand.category).toBe(HandCategory.FullHouse);
    expect(hand.tiebreak).toEqual([14, 13]);
  });

  it("rejects duplicate cards", () => {
    expect(() =>
      evaluateBestHand([
        c("AC"), c("AC"), c("3H"), c("4S"), c("9D"), c("5C"), c("KD"),
      ]),
    ).toThrow(/Duplicate card/);
  });

  it("chosen5 always contains exactly 5 distinct cards", () => {
    const hand = evaluateBestHand([
      c("AH"), c("AD"), c("KC"), c("KD"), c("QS"), c("2C"), c("3D"),
    ]);

    expect(hand.chosen5).toHaveLength(5);
    expect(new Set(hand.chosen5.map(formatCard)).size).toBe(5);
  });
});