import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "../convex/schema";
import { api } from "../convex/_generated/api";

const modules = import.meta.glob("../convex/**/*.ts");

test("lists only the top ten accounts without private credentials", async () => {
  const t = convexTest(schema, modules);
  expect(await t.query(api.leaderboard.list, {})).toEqual([]);
  for (let i = 0; i < 12; i++) {
    await t.run(async (ctx) =>
      ctx.db.insert("coinRecords", {
        loginName: `player-${i}`,
        name: "Ana",
        country: "Colombia",
        maxCoins: i * 100,
      }),
    );
  }
  const rows = await t.query(api.leaderboard.list, {});
  expect(rows).toHaveLength(10);
  expect(rows.map((row) => row.maxCoins)).toEqual([
    1100, 1000, 900, 800, 700, 600, 500, 400, 300, 200,
  ]);
  expect(rows[0]).not.toHaveProperty("sessionId");
  expect(rows[0]).not.toHaveProperty("loginName");
  expect(rows[0]).not.toHaveProperty("pinHash");
});

test("does not rank an old guest record as a second entry for the same player", async () => {
  const t = convexTest(schema, modules);
  const sessionToken = await t.action(api.accounts.register, {
    name: "Adrian",
    pin: "4826",
    country: "Colombia",
  });
  await t.mutation(api.players.awardWin, { sessionToken });
  await t.run(async (ctx) => {
    await ctx.db.insert("coinRecords", {
      sessionId: "old-adrian",
      name: "Adrian",
      country: "Colombia",
      maxCoins: 0,
    });
    for (let i = 0; i < 12; i++)
      await ctx.db.insert("coinRecords", {
        sessionId: `old-guest-${i}`,
        name: `Guest ${i}`,
        country: "Colombia",
        maxCoins: 1000 + i,
      });
  });
  const rows = await t.query(api.leaderboard.list, {});
  expect(rows).toHaveLength(1);
  expect(rows[0]).toMatchObject({ name: "Adrian", maxCoins: 100 });
});
