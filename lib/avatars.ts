export const avatars = [
  { id: "starter-fox", name: "Fox Pilot", price: 0, tier: "starter" },
  { id: "neon-raccoon", name: "Neon Raccoon", price: 1000, tier: "normal" },
  { id: "astro-cat", name: "Astro Cat", price: 1000, tier: "normal" },
  { id: "cyber-gecko", name: "Cyber Gecko", price: 1000, tier: "normal" },
  { id: "shadow-raven", name: "Shadow Raven", price: 3000, tier: "rare" },
  { id: "magma-dragon", name: "Magma Dragon", price: 3000, tier: "rare" },
  { id: "cosmic-wolf", name: "Cosmic Wolf", price: 3000, tier: "rare" },
  { id: "aurora-koi", name: "Aurora Koi", price: 3000, tier: "rare" },
  {
    id: "celestial-knight",
    name: "Celestial Knight",
    price: 5000,
    tier: "legendary",
  },
  { id: "avatar-67", name: "67 Phantom", price: 5000, tier: "legendary" },
  {
    id: "ronaldo-7",
    name: "Ronaldo 7",
    price: 5000,
    tier: "legendary",
    image: "ronaldo-7-v2.webp",
  },
  {
    id: "royal-phoenix",
    name: "Messi 10",
    price: 5000,
    tier: "legendary",
    image: "messi-10-v2.webp",
  },
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
