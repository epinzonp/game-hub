import { expect, test, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "--font-inter" }),
  Geist_Mono: () => ({ variable: "--font-geist-mono" }),
}));

import { metadata } from "../app/layout";

test("social previews use the public site and a shared large image", () => {
  expect(metadata.metadataBase?.toString()).toBe(
    "https://game-hub-epinzonp.vercel.app/",
  );
  expect(metadata.openGraph).toMatchObject({
    images: [
      {
        url: "/social-card.png",
        width: 1200,
        height: 630,
        alt: expect.any(String),
      },
    ],
  });
  expect(metadata.twitter).toMatchObject({
    card: "summary_large_image",
    images: [{ url: "/social-card.png", alt: expect.any(String) }],
  });
});
