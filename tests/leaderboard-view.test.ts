import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { convexTest } from "convex-test";
import { ConvexReactSessionClient } from "convex-helpers/react/sessions";
import { expect, test } from "vitest";
import schema from "../convex/schema";
import { api } from "../convex/_generated/api";
import { LeaderboardStandings } from "../app/components/Leaderboard";

const modules = import.meta.glob("../convex/**/*.ts");

test("shows each real player once, including the podium and remaining ranks", async () => {
  const t = convexTest(schema, modules);
  for (const [index, name] of ["Ana", "Luis", "Eva", "Noa"].entries()) {
    await t.mutation(api.leaderboard.recordBalance, {
      sessionId: new ConvexReactSessionClient(
        "http://127.0.0.1:3210",
      ).getSessionId(),
      name,
      country: "Colombia",
      balance: 400 - index * 100,
    });
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
  await t.mutation(api.leaderboard.recordBalance, {
    sessionId: new ConvexReactSessionClient(
      "http://127.0.0.1:3210",
    ).getSessionId(),
    name: "Ana",
    country: "Colombia",
    balance: 100,
  });
  const html = renderToStaticMarkup(
    createElement(LeaderboardStandings, {
      scores: await t.query(api.leaderboard.list, {}),
    }),
  );
  expect(html.match(/<li /g)).toHaveLength(1);
  expect(html).not.toContain('start="4"');
});
