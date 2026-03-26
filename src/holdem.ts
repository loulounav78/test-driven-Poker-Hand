import { evaluateBestHand } from "./bestHand";
import { compareEvaluatedHands } from "./compare";
import { Card, ComparePlayersResult, PlayerInput, PlayerResult } from "./types";
import { validateNoDuplicateCards } from "./utils";

export function comparePlayers(
  board: [Card, Card, Card, Card, Card],
  players: PlayerInput[],
): ComparePlayersResult {
  validateNoDuplicateCards(board, players.flatMap((p) => p.hole));

  const results: PlayerResult[] = players.map((player) => ({
    id: player.id,
    hole: player.hole,
    best: evaluateBestHand([...board, ...player.hole]),
  }));

  let best = results[0].best;
  for (const result of results.slice(1)) {
    if (compareEvaluatedHands(result.best, best) > 0) {
      best = result.best;
    }
  }

  const winners = results.filter((r) => compareEvaluatedHands(r.best, best) === 0);

  return {
    players: results,
    winners,
  };
}