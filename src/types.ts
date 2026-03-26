export type Suit = "C" | "D" | "H" | "S";

export type Rank =
  | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
  | "T" | "J" | "Q" | "K" | "A";

export type Card = {
  rank: Rank;
  suit: Suit;
};

export enum HandCategory {
  HighCard = 1,
  OnePair = 2,
  TwoPair = 3,
  ThreeOfAKind = 4,
  Straight = 5,
  Flush = 6,
  FullHouse = 7,
  FourOfAKind = 8,
  StraightFlush = 9,
}

export type EvaluatedHand = {
  category: HandCategory;
  categoryName: string;
  chosen5: Card[];
  tiebreak: number[];
};

