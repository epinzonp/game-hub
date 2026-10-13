import { normalizeAvatarId } from "./avatars";
import { readCoinBalance, readCoinRecord } from "./coins";

export function getLegacySnapshot(): string | null {
  const guestId = localStorage.getItem("game-hub-guest-id");
  const saved = localStorage.getItem("user-profile");
  if (!saved || !guestId) return null;
  try {
    const profile: unknown = JSON.parse(saved);
    if (
      typeof profile !== "object" ||
      profile === null ||
      !("name" in profile) ||
      typeof profile.name !== "string" ||
      !("country" in profile) ||
      typeof profile.country !== "string"
    )
      return null;
    const avatar = localStorage.getItem("user-cube");
    return JSON.stringify({
      name: profile.name,
      country: profile.country,
      guestId,
      coins: readCoinBalance(),
      maxCoins: readCoinRecord(),
      avatar: normalizeAvatarId(avatar),
    });
  } catch {
    return null;
  }
}

export function parseLegacySnapshot(snapshot: string | null) {
  if (!snapshot) return null;
  const value: unknown = JSON.parse(snapshot);
  if (
    typeof value !== "object" ||
    value === null ||
    !("name" in value) ||
    typeof value.name !== "string" ||
    !("country" in value) ||
    typeof value.country !== "string" ||
    !("guestId" in value) ||
    typeof value.guestId !== "string" ||
    !("coins" in value) ||
    typeof value.coins !== "number" ||
    !Number.isSafeInteger(value.coins) ||
    value.coins < 0 ||
    !("maxCoins" in value) ||
    typeof value.maxCoins !== "number" ||
    !Number.isSafeInteger(value.maxCoins) ||
    value.maxCoins < 0 ||
    !("avatar" in value) ||
    (value.avatar !== null && typeof value.avatar !== "string")
  )
    return null;
  return {
    name: value.name,
    country: value.country,
    guestId: value.guestId,
    coins: value.coins,
    maxCoins: value.maxCoins,
    avatar: value.avatar,
  };
}

export function clearTransferredProgress() {
  for (const key of [
    "user-profile",
    "user-coins",
    "user-cube",
    "user-coin-record",
    "game-hub-guest-id",
  ])
    localStorage.removeItem(key);
}

export function subscribeToLegacyProgress(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}
