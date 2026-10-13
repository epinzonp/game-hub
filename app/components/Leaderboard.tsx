"use client";

import { useConvexConnectionState, useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { useSyncExternalStore } from "react";
import { Coins, Crown, Medal } from "lucide-react";
import { api } from "../../convex/_generated/api";

type Scores = FunctionReturnType<typeof api.leaderboard.list>;

export default function Leaderboard() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return (
      <p role="status" className="my-12 text-center text-[#e6d9f5]">
        La clasificación no está disponible en este momento.
      </p>
    );
  }
  return <LiveLeaderboard />;
}

function LiveLeaderboard() {
  const scores = useQuery(api.leaderboard.list, {});
  const connection = useConvexConnectionState();
  const connected = useSyncExternalStore(
    () => () => {},
    () => connection.isWebSocketConnected,
    () => false,
  );
  return (
    <section aria-label="Clasificación de monedas" className="mt-6">
      <p
        role="status"
        className="mb-10 flex items-center justify-center gap-2 text-xs font-bold text-[#e6d9f5]"
      >
        <span
          aria-hidden="true"
          className={`size-2 rounded-full ${connected ? "bg-[#fff34b] shadow-[0_0_12px_#fff34b80]" : "bg-[#b695ff]"}`}
        />
        {connected
          ? "En vivo · Se actualiza automáticamente"
          : "Conectando · Los récords se actualizarán al reconectar"}
      </p>
      {scores === undefined ? (
        <p role="status" className="py-16 text-center text-[#e6d9f5]">
          Cargando récords…
        </p>
      ) : (
        <LeaderboardStandings scores={scores} />
      )}
    </section>
  );
}

const podiumStyles = [
  "col-span-2 mx-auto w-full max-w-[270px] border-[#b695ff] bg-gradient-to-b from-[#20122e] via-[#42236b] to-[#8354dc] shadow-[0_0_65px_#8a51e84a,inset_0_0_20px_#b695ff30] sm:order-2 sm:col-span-1 sm:col-start-2 sm:-translate-y-7",
  "border-[#c8c9da] bg-gradient-to-b from-[#17131d] via-[#44424f] to-[#a2a0b0] sm:order-1 sm:col-start-1",
  "border-[#d49b62] bg-gradient-to-b from-[#191218] via-[#58391f] to-[#ad7543] sm:order-3 sm:col-start-3",
];

export function LeaderboardStandings({ scores }: { scores: Scores }) {
  if (scores.length === 0) {
    return (
      <p className="rounded-2xl border border-[#b695ff]/30 bg-[#21142b] p-10 text-center text-[#e6d9f5]">
        Aún no hay récords. ¡Consigue tus primeras monedas!
      </p>
    );
  }
  return (
    <>
      <ol
        aria-label="Primeros tres puestos"
        className="mx-auto grid max-w-3xl grid-cols-2 items-end gap-5 pt-8 sm:grid-cols-3 sm:gap-8 sm:pt-12"
      >
        {scores.slice(0, 3).map((entry, index) => (
          <li
            key={entry._id}
            className={`relative rounded-[22px] border px-3 pb-5 pt-8 text-center sm:px-5 sm:pb-7 ${podiumStyles[index]}`}
          >
            <Crown
              aria-hidden="true"
              className={`absolute -top-8 left-1/2 size-12 -translate-x-1/2 drop-shadow-lg ${index === 0 ? "fill-[#fff34b] text-[#fff34b]" : index === 1 ? "fill-[#deddea] text-[#deddea]" : "fill-[#e5ad73] text-[#e5ad73]"}`}
            />
            <span className="absolute right-3 top-3 flex items-center gap-1 text-sm font-black text-white">
              <Medal className="size-4" aria-hidden="true" />
              <span className="sr-only">Puesto </span>
              {index + 1}
            </span>
            <div
              aria-hidden="true"
              className={`mx-auto grid size-20 place-items-center rounded-full border-2 bg-[#180e25] text-2xl font-black text-white sm:size-24 sm:text-3xl ${index === 0 ? "border-[#d2baff] shadow-[0_0_28px_#c191ff90]" : "border-white/65"}`}
            >
              {entry.name.trim().slice(0, 2).toLocaleUpperCase("es")}
            </div>
            <h2 className="mt-4 break-words text-base font-black leading-tight text-white sm:text-xl">
              {entry.name}
            </h2>
            <p className="mt-1 text-xs text-white/90">{entry.country}</p>
            <p className="mb-2 mt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/90">
              Récord de monedas
            </p>
            <p className="flex flex-wrap items-center justify-center gap-2 rounded-full bg-[#100b13] px-2 py-3 text-lg font-black tabular-nums text-[#fff34b] sm:text-2xl">
              <Coins aria-hidden="true" className="size-5" />
              {entry.maxCoins.toLocaleString("es-CO")}
              <span className="sr-only"> monedas</span>
            </p>
          </li>
        ))}
      </ol>
      {scores.length > 3 && (
        <section
          aria-labelledby="remaining-ranks-heading"
          className="mt-14 sm:mt-16"
        >
          <h2 id="remaining-ranks-heading" className="sr-only">
            Puestos del 4 al 10
          </h2>
          <div
            aria-hidden="true"
            className="mb-5 grid grid-cols-[2rem_1fr_6rem] gap-3 rounded-full bg-[#7547cb] px-5 py-4 text-[10px] font-black uppercase tracking-wider sm:grid-cols-[4rem_1fr_10rem] sm:px-8 sm:text-xs"
          >
            <span>Puesto</span>
            <span>Jugador</span>
            <span className="text-right">Récord</span>
          </div>
          <ol start={4} className="space-y-3">
            {scores.slice(3).map((entry, index) => (
              <li
                key={entry._id}
                className="grid grid-cols-[2rem_1fr_6rem] items-center gap-3 rounded-2xl border border-[#9466d4]/45 bg-gradient-to-r from-[#55318b] via-[#24172f] to-[#160f20] px-5 py-4 sm:grid-cols-[4rem_1fr_10rem] sm:rounded-full sm:px-8"
              >
                <span className="text-sm font-black text-[#dfcaff]">
                  <span className="sr-only">Puesto </span>
                  {index + 4}
                </span>
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="hidden size-10 shrink-0 place-items-center rounded-full border border-[#b695ff]/60 bg-[#352044] text-xs font-black sm:grid"
                  >
                    {entry.name.trim().slice(0, 2).toLocaleUpperCase("es")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-white">
                      {entry.name}
                    </h3>
                    <p className="text-xs text-[#d8c9e6]">{entry.country}</p>
                  </div>
                </div>
                <p className="flex flex-wrap items-center justify-end gap-1 text-right text-sm font-black tabular-nums text-[#fff34b] sm:text-base">
                  <Coins className="size-4" aria-hidden="true" />
                  {entry.maxCoins.toLocaleString("es-CO")}
                  <span className="sr-only"> monedas</span>
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
