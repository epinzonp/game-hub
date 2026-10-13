import { expect, test } from "vitest";
import { games } from "../app/components/GameHub";
import {
  gameRouteIds,
  isGameRoute,
  isGameRouteId,
  shouldConfirmGameExit,
} from "../lib/game-routes";

test("every playable game has a valid route ID", () => {
  expect(games.map((game) => game.id)).toEqual(gameRouteIds);
  for (const gameId of gameRouteIds) expect(isGameRouteId(gameId)).toBe(true);
  expect(isGameRouteId("store")).toBe(false);
});

test("only leaving a game route needs the unfinished-points warning", () => {
  expect(isGameRoute("/games/hangman")).toBe(true);
  expect(isGameRoute("/")).toBe(false);
  expect(shouldConfirmGameExit("/games/hangman", "/")).toBe(true);
  expect(shouldConfirmGameExit("/games/hangman", "/games/tiragol")).toBe(true);
  expect(shouldConfirmGameExit("/games/hangman", "/games/hangman")).toBe(false);
  expect(shouldConfirmGameExit("/", "/games/hangman")).toBe(false);
});
