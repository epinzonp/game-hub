import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Trophy } from "lucide-react";
import Leaderboard from "@/app/components/Leaderboard";

export const metadata: Metadata = { title: "Clasificación de monedas" };

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen w-full bg-[#100b13] text-[#fffaf2]">
      <header className="border-b border-white/15 bg-[#241519]">
        <nav
          aria-label="Navegación principal"
          className="mx-auto flex min-h-20 max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8"
        >
          <Link
            href="/"
            className="flex min-h-11 items-center gap-2 text-lg font-black tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fff34b]"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            GAME <span className="text-[#fff34b]">HUB</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-8">
            <Link
              href="/leaderboard"
              aria-current="page"
              className="flex min-h-11 items-center gap-2 text-sm font-bold text-[#c4a2ff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fff34b]"
            >
              <Trophy className="size-4" aria-hidden="true" />
              Clasificación
            </Link>
            <Link
              href="/store"
              className="flex min-h-11 items-center gap-2 text-sm font-bold hover:text-[#fff34b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fff34b]"
            >
              <ShoppingBag className="size-4" aria-hidden="true" />
              Tienda
            </Link>
          </div>
        </nav>
      </header>
      <main className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[540px] rounded-b-[50%] bg-[radial-gradient(ellipse_at_top,#7041c5_0%,#321d4d_45%,#100b13_75%)]"
        />
        <div className="mx-auto max-w-5xl px-5 pb-16 pt-12 sm:px-8 sm:pt-20">
          <div className="text-center">
            <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl border border-[#b795ff]/50 bg-[#7344cb]/25 shadow-[0_0_50px_#8753ee40]">
              <Trophy className="size-9 text-[#fff34b]" aria-hidden="true" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#c4a2ff]">
              Game Hub · Top 10
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] sm:text-6xl">
              Los mejores <span className="text-[#b695ff]">récords.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#e6d9f5]">
              Cada moneda cuenta. Estos son los mayores saldos alcanzados.
              Gastar en la tienda no baja tu récord.
            </p>
          </div>
          <Leaderboard />
          <div className="mt-10 flex flex-col items-center gap-5 border-t border-[#b695ff]/20 pt-8 text-center">
            <p className="text-sm text-[#d8c9e6]">
              Juega, consigue monedas y supera tu mejor marca.
            </p>
            <Link
              href="/"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#fff34b] px-7 text-sm font-black text-[#180e13] transition hover:bg-[#fff877] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Volver al hub
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
