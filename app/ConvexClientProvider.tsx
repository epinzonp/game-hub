"use client";

import { ConvexProvider } from "convex/react";
import { ConvexReactSessionClient } from "convex-helpers/react/sessions";
import type { ReactNode } from "react";

const url = process.env.NEXT_PUBLIC_CONVEX_URL;
const client = url
  ? new ConvexReactSessionClient(url, {
      storageKey: "game-hub-guest-id",
      storage: {
        getItem: (key) =>
          typeof window === "undefined" ? null : localStorage.getItem(key),
        setItem: (key, value) => {
          if (typeof window !== "undefined") localStorage.setItem(key, value);
        },
      },
    })
  : null;

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  if (!client) return children;
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
