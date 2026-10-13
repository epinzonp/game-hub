import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("convex/react", () => ({
  useAction: () => async () => "session",
  useMutation: () => async () => undefined,
  useQuery: () => undefined,
}));

vi.mock("@/app/components/GameHub", () => ({
  default: () => <div>Game Hub</div>,
}));

vi.mock("@/app/components/UserProfileModal", () => ({
  default: () => <div>Login modal</div>,
}));

import { GameHubShell } from "../app/page";

describe("GameHubShell session hydration", () => {
  it("keeps the login modal hidden until the browser session is restored", () => {
    const markup = renderToString(<GameHubShell />);

    expect(markup).toContain("Cargando tu progreso");
    expect(markup).not.toContain("Login modal");
  });
});
