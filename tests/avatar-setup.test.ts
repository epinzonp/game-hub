import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { AvatarSetupChoices } from "../app/components/AvatarSetupDialog";

test("offers only affordable avatars, including the free option at zero coins", () => {
  const choices = (coins: number) =>
    renderToStaticMarkup(
      createElement(AvatarSetupChoices, {
        coins,
        pending: false,
        onChoose: () => {},
      }),
    );
  expect(choices(0)).toContain("Fox Pilot");
  expect(choices(0)).toContain("Elegir gratis");
  expect(choices(0)).not.toContain("Neon Raccoon");
  expect(choices(500)).toContain("Neon Raccoon");
  expect(choices(500)).not.toContain("Astro Cat");
});
