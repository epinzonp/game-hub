export const gameRouteIds = [
  "hangman",
  "tiragol",
  "noledes",
  "airhockey",
  "botecolor",
  "pinpon",
  "radiotricky",
] as const;

export type GameRouteId = (typeof gameRouteIds)[number];

export function isGameRouteId(value: string): value is GameRouteId {
  return gameRouteIds.some((gameId) => gameId === value);
}

export function isGameRoute(pathname: string) {
  return gameRouteIds.some((gameId) => pathname === `/games/${gameId}`);
}

export function shouldConfirmGameExit(fromPath: string, toPath: string) {
  return isGameRoute(fromPath) && fromPath !== toPath;
}
