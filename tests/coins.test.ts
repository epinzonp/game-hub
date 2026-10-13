import { afterEach, expect, test, vi } from "vitest";
import {
  readCoinBalance,
  readCoinRecord,
  saveCoinBalance,
  subscribeToCoins,
} from "../lib/coins";

afterEach(() => vi.unstubAllGlobals());

test("keeps a local peak through purchases and notifies same-tab subscribers", () => {
  const storage = new Map<string, string>([["user-coins", "500"]]);
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  });
  vi.stubGlobal("window", new EventTarget());
  const onChange = vi.fn();
  const unsubscribe = subscribeToCoins(onChange);
  saveCoinBalance(200);
  expect(readCoinBalance()).toBe(200);
  expect(readCoinRecord()).toBe(500);
  saveCoinBalance(600);
  expect(readCoinRecord()).toBe(600);
  expect(onChange).toHaveBeenCalledTimes(2);
  unsubscribe();
  saveCoinBalance(0);
  expect(onChange).toHaveBeenCalledTimes(2);
  expect(() => saveCoinBalance(-1)).toThrow("Saldo inválido");
  expect(readCoinRecord()).toBe(600);
});

test("treats corrupt saved balances as zero", () => {
  vi.stubGlobal("localStorage", { getItem: () => "not a number" });
  expect(readCoinBalance()).toBe(0);
  expect(readCoinRecord()).toBe(0);
});
