"use client";

import { useConvex, useMutation } from "convex/react";
import { ConvexReactSessionClient } from "convex-helpers/react/sessions";
import { useEffect, useState, useSyncExternalStore } from "react";
import { api } from "@/convex/_generated/api";
import {
  readCoinRecord,
  saveCoinBalance,
  readCoinBalance,
  subscribeToCoins,
} from "@/lib/coins";

export default function CoinScoreSync({
  name,
  country,
}: {
  name: string;
  country: string;
}) {
  const client = useConvex();
  const recordBalance = useMutation(api.leaderboard.recordBalance);
  const maxCoins = useSyncExternalStore(
    subscribeToCoins,
    readCoinRecord,
    () => 0,
  );
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    // Preserve the initial balance before a purchase, including while offline.
    saveCoinBalance(readCoinBalance());
  }, []);

  useEffect(() => {
    if (!(client instanceof ConvexReactSessionClient)) return;
    let active = true;
    void recordBalance({
      sessionId: client.getSessionId(),
      name,
      country,
      balance: maxCoins,
    })
      .then(() => {
        if (active) setError(false);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [client, recordBalance, name, country, maxCoins, retry]);

  if (!error) return null;
  return (
    <div
      role="alert"
      className="fixed bottom-4 left-4 right-4 z-50 rounded-xl bg-[#391923] p-4 text-white shadow-xl"
    >
      No pudimos guardar tu récord. Sigue guardado en este navegador.
      <button
        type="button"
        onClick={() => setRetry((value) => value + 1)}
        className="ml-3 min-h-11 rounded-lg bg-[#fff34b] px-4 font-bold text-[#180e13] focus-visible:outline-2 focus-visible:outline-white"
      >
        Reintentar
      </button>
    </div>
  );
}
