export const avatars = [
  { id: "starter-fox", name: "Fox Pilot", price: 0, tier: "starter" },
  { id: "neon-raccoon", name: "Neon Raccoon", price: 500, tier: "rare" },
  { id: "astro-cat", name: "Astro Cat", price: 1000, tier: "rare" },
  { id: "cyber-gecko", name: "Cyber Gecko", price: 2000, tier: "epic" },
  { id: "shadow-raven", name: "Shadow Raven", price: 5000, tier: "epic" },
  { id: "magma-dragon", name: "Magma Dragon", price: 10000, tier: "legendary" },
  { id: "cosmic-wolf", name: "Cosmic Wolf", price: 15000, tier: "legendary" },
  { id: "aurora-koi", name: "Aurora Koi", price: 20000, tier: "mythic" },
  {
    id: "celestial-knight",
    name: "Celestial Knight",
    price: 30000,
    tier: "mythic",
  },
  { id: "avatar-67", name: "67 Phantom", price: 67000, tier: "mythic" },
];
const legacyAvatarIds: Record<string, string> = {
  "😊": "starter-fox",
  "😢": "astro-cat",
  "😡": "magma-dragon",
  "😱": "shadow-raven",
  "😎": "cosmic-wolf",
  "😴": "aurora-koi",
  "67": "avatar-67",
};

export function normalizeAvatarId(id: string | null) {
  if (!id) return null;
  return avatars.some((avatar) => avatar.id === id)
    ? id
    : (legacyAvatarIds[id] ?? null);
}
