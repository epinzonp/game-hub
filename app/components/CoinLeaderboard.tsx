"use client";

import { useConvexConnectionState, useQuery } from "convex/react";
import { Coins, Trophy } from "lucide-react";
import { api } from "@/convex/_generated/api";

export default function CoinLeaderboard() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return (
      <p role="status" className="my-10 text-rose-100">
        La clasificación de monedas no está disponible en este momento.
      </p>
    );
  }
  return <LiveCoinLeaderboard />;
}

function LiveCoinLeaderboard() {
  const scores = useQuery(api.leaderboard.list, {});
  const connection = useConvexConnectionState();
  return (
    <section
      aria-labelledby="coin-leaderboard-heading"
      className="my-10 rounded-2xl border border-rose-200/30 bg-[#241519] p-5 sm:p-8"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="coin-leaderboard-heading"
            className="flex items-center gap-3 text-2xl font-black text-white"
          >
            <Trophy className="text-[#fff34b]" aria-hidden="true" />
            Récords de monedas
          </h2>
          <p className="mt-2 text-sm text-rose-100/80">
            Los 10 mejores saldos alcanzados. Gastar monedas no baja tu récord.
          </p>
        </div>
        <span
          role="status"
          className="rounded-full bg-[#391923] px-3 py-2 text-sm font-bold text-[#fff34b]"
        >
          {connection.isWebSocketConnected ? "En vivo" : "Conectando…"}
        </span>
      </div>
      {scores === undefined ? (
        <p role="status" className="text-rose-100">
          Cargando clasificación…
        </p>
      ) : scores.length === 0 ? (
        <p className="text-rose-100">
          Aún no hay récords. ¡Consigue tus primeras monedas!
        </p>
      ) : (
        <ol className="grid gap-2 sm:grid-cols-2">
          {scores.map((entry, index) => (
            <li
              key={entry._id}
              className="flex min-w-0 items-center gap-3 rounded-xl bg-[#391923] p-4"
            >
              <span className="w-7 shrink-0 font-black text-[#fff34b]">
                {index + 1}.
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-white">{entry.name}</p>
                <p className="text-sm text-rose-100/80">{entry.country}</p>
              </div>
              <span className="flex shrink-0 items-center gap-2 font-black tabular-nums text-[#fff34b]">
                <Coins className="size-4" aria-hidden="true" />
                {entry.maxCoins.toLocaleString("es-CO")}
                <span className="sr-only"> monedas</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
