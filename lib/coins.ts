export const coinChangeEvent = "user-coins-change";

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

export function saveCoinBalance(balance: number) {
  if (!Number.isSafeInteger(balance) || balance < 0)
    throw new Error("Saldo inválido");
  localStorage.setItem(
    "user-coin-record",
    String(Math.max(readCoinRecord(), balance)),
  );
  localStorage.setItem("user-coins", String(balance));
  window.dispatchEvent(new Event(coinChangeEvent));
}

export function subscribeToCoins(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(coinChangeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(coinChangeEvent, onChange);
  };
}
