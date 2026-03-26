# Texas Hold'em Hand Evaluator

## Features
- Evaluate the best 5-card poker hand out of 7 available cards
- Compare multiple Texas Hold'em players
- Support ties / split pots
- Return the exact chosen best 5 cards
- Support ace-low straight (`A-2-3-4-5`)

## Validation
This implementation validates inputs and rejects duplicated cards.

## chosen5 ordering
To keep tests deterministic, `chosen5` is returned in a stable order:

- Straight / Straight Flush: highest to lowest in straight order
  - wheel: `5 4 3 2 A`
- Four of a Kind: quads first, then kicker
- Full House: trips first, then pair
- Flush / High Card: descending ranks
- Three of a Kind: trips first, then kickers descending
- Two Pair: higher pair, lower pair, kicker
- One Pair: pair first, then kickers descending

When cards have the same rank inside `chosen5`, output order is stabilized with an internal suit ordering only to make tests deterministic. Suits are never used to break ties between poker hands.

## TDD approach
The repository history is organized in small steps:
- tests added first for new behavior
- minimal implementation to make tests pass
- refactoring while keeping the test suite green