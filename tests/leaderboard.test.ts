import { convexTest } from "convex-test";
import { ConvexReactSessionClient } from "convex-helpers/react/sessions";
import { expect, test } from "vitest";
import schema from "../convex/schema";
import { api } from "../convex/_generated/api";

const modules = import.meta.glob("../convex/**/*.ts");
const guest = () =>
  new ConvexReactSessionClient("http://127.0.0.1:3210").getSessionId();

test("keeps the maximum through spending, retries, and concurrent updates", async () => {
  const t = convexTest(schema, modules);
  const player = { sessionId: guest(), name: "Ana", country: "Colombia" };
  await t.mutation(api.leaderboard.recordBalance, { ...player, balance: 100 });
  await t.mutation(api.leaderboard.recordBalance, { ...player, balance: 20 });
  expect((await t.query(api.leaderboard.list, {}))[0].maxCoins).toBe(100);
  await Promise.all(
    [200, 150, 200].map((balance) =>
      t.mutation(api.leaderboard.recordBalance, { ...player, balance }),
    ),
  );
  const rows = await t.query(api.leaderboard.list, {});
  expect(rows).toHaveLength(1);
  expect(rows[0].maxCoins).toBe(200);
  expect(rows[0]).not.toHaveProperty("sessionId");
});

test("separates guests with the same name and orders the top ten", async () => {
  const t = convexTest(schema, modules);
  expect(await t.query(api.leaderboard.list, {})).toEqual([]);
  for (let i = 0; i < 12; i++) {
    await t.mutation(api.leaderboard.recordBalance, {
      sessionId: guest(),
      name: "Ana",
      country: "Colombia",
      balance: i * 100,
    });
  }
  const rows = await t.query(api.leaderboard.list, {});
  expect(rows).toHaveLength(10);
  expect(rows.map((row) => row.maxCoins)).toEqual([
    1100, 1000, 900, 800, 700, 600, 500, 400, 300, 200,
  ]);
});

test("rejects invalid balances and profiles without writing rows", async () => {
  const t = convexTest(schema, modules);
  const player = { sessionId: guest(), name: "Ana", country: "Colombia" };
  for (const balance of [-1, 1.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1]) {
    await expect(
      t.mutation(api.leaderboard.recordBalance, { ...player, balance }),
    ).rejects.toThrow();
  }
  for (const name of ["", "   ", "a".repeat(33)]) {
    await expect(
      t.mutation(api.leaderboard.recordBalance, {
        ...player,
        name,
        balance: 0,
      }),
    ).rejects.toThrow();
  }
  expect(await t.query(api.leaderboard.list, {})).toEqual([]);
});
