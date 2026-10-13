import { afterEach, expect, test, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import UserProfileModal from "../app/components/UserProfileModal";
import {
  getLegacySnapshot,
  parseLegacySnapshot,
  clearTransferredProgress,
} from "../lib/legacy-progress";

afterEach(() => vi.unstubAllGlobals());

test("keeps the legacy country selected during account setup", () => {
  const html = renderToStaticMarkup(
    createElement(UserProfileModal, {
      initialName: "Ana",
      initialCountry: "Perú",
      hasLegacy: true,
      onSave: async () => {},
    }),
  );
  expect(html).toContain('<option value="Perú" selected="">');
});

test("reads legacy progress for an explicit transfer and only clears progress keys", () => {
  const storage = new Map<string, string>([
    ["user-coins", "500"],
    ["user-coin-record", "800"],
    ["user-profile", JSON.stringify({ name: "Ana", country: "Colombia" })],
    ["game-hub-guest-id", "guest-id"],
    ["user-cube", "neon-raccoon"],
    ["hangman-scores", "[]"],
  ]);
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    removeItem: (key: string) => storage.delete(key),
  });
  expect(parseLegacySnapshot(getLegacySnapshot())).toEqual({
    name: "Ana",
    country: "Colombia",
    guestId: "guest-id",
    coins: 500,
    maxCoins: 800,
    avatar: "neon-raccoon",
  });
  clearTransferredProgress();
  expect(getLegacySnapshot()).toBeNull();
  expect(storage.get("hangman-scores")).toBe("[]");
});

test("rejects invalid local profile data and does not write or erase it", () => {
  const storage = new Map<string, string>([
    ["game-hub-guest-id", "guest-id"],
    ["user-profile", "broken json"],
  ]);
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
  });
  expect(getLegacySnapshot()).toBeNull();
  expect(storage.get("user-profile")).toBe("broken json");
});
