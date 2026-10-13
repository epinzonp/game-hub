import { readFile } from "node:fs/promises";
import { expect, test } from "vitest";
import sharp from "sharp";

test("all game entry covers have enough real pixels for the tall retina artwork panel", async () => {
  const hub = await readFile(
    new URL("../app/components/GameHub.tsx", import.meta.url),
    "utf8",
  );
  const covers = [...hub.matchAll(/image: "(\/game-covers\/[^\"]+)"/g)].map(
    (match) => match[1],
  );
  expect(covers).toHaveLength(7);
  for (const cover of covers) {
    const metadata = await sharp(
      new URL(`../public${cover}`, import.meta.url).pathname,
    ).metadata();
    expect(metadata.width, cover).toBeGreaterThanOrEqual(1500);
    expect(metadata.height, cover).toBeGreaterThanOrEqual(1000);
  }
});
