import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "../convex/schema";
import { api } from "../convex/_generated/api";

const modules = import.meta.glob("../convex/**/*.ts");
const profile = { name: "Ana", country: "Colombia", pin: "4826" };

async function account(t: ReturnType<typeof convexTest>, name = "Ana") {
  return {
    sessionToken: await t.action(api.accounts.register, { ...profile, name }),
  };
}

test("nickname and PIN restore the same account on another device without exposing credentials", async () => {
  const t = convexTest(schema, modules);
  const ana = await account(t);
  const other = await account(t, "Luis");
  await t.mutation(api.players.awardWin, ana);
  const restored = {
    sessionToken: await t.action(api.accounts.login, {
      name: " ANA ",
      pin: profile.pin,
    }),
  };
  expect(await t.query(api.players.me, restored)).toEqual(
    await t.query(api.players.me, ana),
  );
  expect((await t.query(api.players.me, other))?.coins).toBe(0);
  await expect(
    t.action(api.accounts.register, { ...profile, name: "ana" }),
  ).rejects.toThrow("ya está en uso");
  expect(await t.query(api.players.me, { sessionToken: "invalid" })).toBeNull();
  await expect(
    t.mutation(api.players.awardWin, { sessionToken: "invalid" }),
  ).rejects.toThrow("Inicia sesión");
  const rows = await t.query(api.leaderboard.list, {});
  expect(rows[0]).not.toHaveProperty("pinHash");
  expect(rows[0]).not.toHaveProperty("sessionToken");
  expect(rows[0]).not.toHaveProperty("coins");
  await t.mutation(api.players.signOut, ana);
  expect(await t.query(api.players.me, ana)).toBeNull();
  expect((await t.query(api.players.me, restored))?.coins).toBe(100);
});

test("rejects invalid PINs, limits failed attempts, and expires sessions", async () => {
  const t = convexTest(schema, modules);
  await expect(
    t.action(api.accounts.register, { ...profile, pin: "x123" }),
  ).rejects.toThrow();
  await expect(
    t.action(api.accounts.register, { ...profile, name: " " }),
  ).rejects.toThrow();
  const ana = await account(t);
  for (let i = 0; i < 5; i++)
    await expect(
      t.action(api.accounts.login, { name: "Ana", pin: "0000" }),
    ).rejects.toThrow("Nombre o PIN incorrectos");
  await expect(
    t.action(api.accounts.login, { name: "Ana", pin: profile.pin }),
  ).rejects.toThrow("Espera");
  await t.run(async (ctx) => {
    const session = await ctx.db.query("playerSessions").first();
    if (!session) throw new Error("Missing session");
    await ctx.db.patch(session._id, { expiresAt: Date.now() - 1 });
  });
  expect(await t.query(api.players.me, ana)).toBeNull();
});

test("imports a guest record once, preserving its maximum and avatar", async () => {
  const t = convexTest(schema, modules);
  await t.run(async (ctx) =>
    ctx.db.insert("coinRecords", {
      sessionId: "legacy-guest",
      name: "Ana",
      country: "Colombia",
      maxCoins: 800,
    }),
  );
  const legacy = {
    guestId: "legacy-guest",
    coins: 500,
    maxCoins: 800,
    avatar: "neon-raccoon",
  };
  const ana = {
    sessionToken: await t.action(api.accounts.register, { ...profile, legacy }),
  };
  expect((await t.query(api.players.me, ana))?.coins).toBe(500);
  expect((await t.query(api.players.me, ana))?.avatar).toBe("neon-raccoon");
  expect(await t.query(api.leaderboard.list, {})).toHaveLength(1);
  await expect(
    t.action(api.accounts.register, { ...profile, name: "Luis", legacy }),
  ).rejects.toThrow("ya se transfirió");
});

test("purchases use server prices, concurrent rewards add up, and spending preserves the maximum", async () => {
  const t = convexTest(schema, modules);
  const ana = await account(t);
  for (let i = 0; i < 4; i++) await t.mutation(api.players.awardWin, ana);
  await Promise.all([
    t.mutation(api.players.awardWin, ana),
    t.mutation(api.players.awardWin, ana),
  ]);
  await t.mutation(api.players.purchaseAvatar, {
    ...ana,
    avatar: "neon-raccoon",
  });
  await t.mutation(api.players.purchaseAvatar, {
    ...ana,
    avatar: "neon-raccoon",
  });
  const saved = await t.query(api.players.me, ana);
  expect(saved?.coins).toBe(100);
  expect(saved?.maxCoins).toBe(600);
  expect(saved?.avatar).toBe("neon-raccoon");
  await expect(
    t.mutation(api.players.purchaseAvatar, { ...ana, avatar: "astro-cat" }),
  ).rejects.toThrow("No tienes suficientes");
  await expect(
    t.mutation(api.players.purchaseAvatar, { ...ana, avatar: "fake" }),
  ).rejects.toThrow("Avatar inválido");
  expect(await t.query(api.players.me, ana)).toEqual(saved);
});
