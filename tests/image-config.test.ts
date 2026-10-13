import { expect, test } from "vitest";
import { hasLocalMatch } from "next/dist/shared/lib/match-local-pattern";
import config from "../next.config";

test("allows the refreshed game covers while keeping other image query strings blocked", () => {
  const patterns = config.images?.localPatterns;
  expect(hasLocalMatch(patterns, "/game-covers/cover-1.webp?v=2")).toBe(true);
  expect(hasLocalMatch(patterns, "/avatars/starter-fox.webp")).toBe(true);
  expect(hasLocalMatch(patterns, "/avatars/starter-fox.webp?v=2")).toBe(false);
  expect(hasLocalMatch(patterns, "/game-covers/cover-1.webp?v=3")).toBe(false);
});
