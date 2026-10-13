function readAmount(key: string): number {
  const value = Number(localStorage.getItem(key) || "0");
  return Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

export function readCoinBalance(): number {
  return readAmount("user-coins");
}

export function readCoinRecord(): number {
  return Math.max(readCoinBalance(), readAmount("user-coin-record"));
}
