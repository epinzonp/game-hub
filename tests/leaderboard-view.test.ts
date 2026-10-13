import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { convexTest } from "convex-test";
import { afterEach, expect, test, vi } from "vitest";
import schema from "../convex/schema";
import { api } from "../convex/_generated/api";
import Leaderboard, {
  LeaderboardStandings,
} from "../app/components/Leaderboard";

const modules = import.meta.glob("../convex/**/*.ts");

test("shows each real player once, including the podium and remaining ranks", async () => {
  const t = convexTest(schema, modules);
  for (const [index, name] of ["Ana", "Luis", "Eva", "Noa"].entries()) {
    await t.run(async (ctx) =>
      ctx.db.insert("coinRecords", {
        loginName: name.toLowerCase(),
        name,
        country: "Colombia",
        maxCoins: 400 - index * 100,
      }),
    );
  }
  const scores = await t.query(api.leaderboard.list, {});
  const html = renderToStaticMarkup(
    createElement(LeaderboardStandings, { scores }),
  );
  for (const name of ["Ana", "Luis", "Eva", "Noa"]) {
    expect(html.split(`>${name}<`)).toHaveLength(2);
  }
  expect(html).toContain('aria-label="Primeros tres puestos"');
  expect(html).toContain('start="4"');
});

test("does not invent players when fewer than three have records", async () => {
  const t = convexTest(schema, modules);
  const empty = renderToStaticMarkup(
    createElement(LeaderboardStandings, {
      scores: await t.query(api.leaderboard.list, {}),
    }),
  );
  expect(empty).toContain("Aún no hay récords");
  await t.run(async (ctx) =>
    ctx.db.insert("coinRecords", {
      loginName: "ana",
      name: "Ana",
      country: "Colombia",
      maxCoins: 100,
    }),
  );
  const html = renderToStaticMarkup(
    createElement(LeaderboardStandings, {
      scores: await t.query(api.leaderboard.list, {}),
    }),
  );
  expect(html.match(/<li /g)).toHaveLength(1);
  expect(html).not.toContain('start="4"');
});

vi.mock("convex/react", () => ({
  useQuery: () => undefined,
  useConvexConnectionState: () => ({ isWebSocketConnected: true }),
}));
afterEach(() => vi.unstubAllEnvs());

test("server-rendered connection status starts connecting even when the client snapshot is ready", () => {
  vi.stubEnv("NEXT_PUBLIC_CONVEX_URL", "http://localhost:3210");
  const html = renderToStaticMarkup(createElement(Leaderboard));
  expect(html).toContain(
    "Conectando · Los récords se actualizarán al reconectar",
  );
  expect(html).not.toContain("En vivo · Se actualiza automáticamente");
});
