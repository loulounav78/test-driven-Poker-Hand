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
});