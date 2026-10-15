"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { detenerFunkLoop, reproducirFunkLoop } from "@/lib/sonido";

type MusicContextValue = {
  active: boolean;
  setActive: (active: boolean) => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) {
      detenerFunkLoop();
      return;
    }

    void reproducirFunkLoop().catch(() => setActive(false));
  }, [active]);

  return (
    <MusicContext.Provider value={{ active, setActive }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const music = useContext(MusicContext);
  if (!music) throw new Error("MusicProvider is missing.");
  return music;
}
