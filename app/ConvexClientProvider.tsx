"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";
import GameNavigationGuard from "@/app/components/GameNavigationGuard";

const url = process.env.NEXT_PUBLIC_CONVEX_URL;
const client = url ? new ConvexReactClient(url) : null;

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  if (!client)
    return (
      <p role="alert" className="p-8 text-white">
        El hub no está disponible en este momento.
      </p>
    );
  return (
    <ConvexProvider client={client}>
      <GameNavigationGuard>{children}</GameNavigationGuard>
    </ConvexProvider>
  );
}
