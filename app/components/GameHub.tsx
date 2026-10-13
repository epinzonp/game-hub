"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Coins,
  Gamepad2,
  House,
  LogOut,
  Music2,
  ShoppingBag,
  UsersRound,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { detenerFunkLoop, reproducirFunkLoop } from "@/lib/sonido";
import HangmanGameWrapper from "./HangmanGameWrapper";
import Tiragol from "./Tiragol";
import AirHockey from "./AirHockey";
import Botecolor from "./Botecolor";
import Radiotricky from "./Radiotricky";
import PinPon from "./PinPon";
import NoLeDesOPegale from "./NoLeDesOPegale";

type GameId =
  | "hangman"
  | "tiragol"
  | "airhockey"
  | "botecolor"
  | "pinpon"
  | "radiotricky"
  | "friends"
  | "store"
  | "noledes"
  | null;

const games = [
  {
    id: "hangman",
    title: "El Ahorcado",
    description: "Adivina la palabra antes de que el muñeco caiga en la lava.",
    image: "/game-covers/cover-0.webp",
    label: "Palabras",
  },
  {
    id: "tiragol",
    title: "Tiragol",
    description: "Apunta, dispara y busca tu mejor récord de goles.",
    image: "/game-covers/cover-1.webp",
    label: "Deportes",
  },
  {
    id: "noledes",
    title: "No Le Des o Pégale",
    description: "¡Rápido! Pégale a los muñecos antes de que se escondan.",
    image: "/game-covers/cover-2.webp",
    label: "Reflejos",
  },
  {
    id: "airhockey",
    title: "Hockey de Aire",
    description: "Desliza el disco y vence a la IA o a un amigo.",
    image: "/game-covers/cover-3.webp",
    label: "Deportes",
  },
  {
    id: "botecolor",
    title: "Botecolor",
    description: "Organiza los colores en las botellas.",
    image: "/game-covers/cover-4.webp",
    label: "Rompecabezas",
  },
  {
    id: "pinpon",
    title: "Pin Pon",
    description: "Rebota la pelota, aguanta el ritmo y gana.",
    image: "/game-covers/cover-5.webp",
    label: "Deportes",
  },
  {
    id: "radiotricky",
    title: "Radiotricky",
    description: "Tres en Raya con onda. VS amigo o IA.",
    image: "/game-covers/cover-6.webp",
    label: "Estrategia",
  },
] as const;

const avatars = [
  { id: "starter-fox", name: "Fox Pilot", price: 0, tier: "starter" },
  { id: "neon-raccoon", name: "Neon Raccoon", price: 500, tier: "rare" },
  { id: "astro-cat", name: "Astro Cat", price: 1000, tier: "rare" },
  { id: "cyber-gecko", name: "Cyber Gecko", price: 2000, tier: "epic" },
  { id: "shadow-raven", name: "Shadow Raven", price: 5000, tier: "epic" },
  { id: "magma-dragon", name: "Magma Dragon", price: 10000, tier: "legendary" },
  { id: "cosmic-wolf", name: "Cosmic Wolf", price: 15000, tier: "legendary" },
  { id: "aurora-koi", name: "Aurora Koi", price: 20000, tier: "mythic" },
  { id: "celestial-knight", name: "Celestial Knight", price: 30000, tier: "mythic" },
  { id: "avatar-67", name: "67 Phantom", price: 67000, tier: "mythic" },
];

const avatarById = Object.fromEntries(avatars.map((avatar) => [avatar.id, avatar]));
const legacyAvatarIds: Record<string, string> = {
  "😊": "starter-fox",
  "😢": "astro-cat",
  "😡": "magma-dragon",
  "😱": "shadow-raven",
  "😎": "cosmic-wolf",
  "😴": "aurora-koi",
  "67": "avatar-67",
};
const tierLabels: Record<string, string> = {
  starter: "Inicial",
  rare: "Raro",
  epic: "Épico",
  legendary: "Legendario",
  mythic: "Mítico",
};

function normalizeAvatarId(id: string | null) {
  if (!id) return null;
  return id in avatarById ? id : (legacyAvatarIds[id] ?? null);
}

function AvatarPortrait({
  id,
  size = 40,
  className,
}: {
  id: string | null;
  size?: number;
  className?: string;
}) {
  const avatar = id ? avatarById[id as keyof typeof avatarById] : undefined;
  if (!avatar) return <span className={className}>?</span>;
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={avatar.name}
      className={className}
    >
      <defs>
        <radialGradient id={`avatar-bg-${avatar.id}`} cx="35%" cy="25%">
          <stop stopColor={avatar.tier === "starter" ? "#235b9c" : "#563078"} />
          <stop offset="1" stopColor="#1b1019" />
        </radialGradient>
        <linearGradient id={`avatar-metal-${avatar.id}`} x2="0" y2="1">
          <stop stopColor="#fff8bf" />
          <stop offset=".45" stopColor="#f7cf55" />
          <stop offset="1" stopColor="#a84438" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill={`url(#avatar-bg-${avatar.id})`} />
      <circle cx="50" cy="51" r="38" fill="none" stroke="#fff34b" strokeOpacity=".2" strokeWidth="1.5" />
      <path d="M17 89c3-19 15-27 33-27s30 8 33 27" fill="#23151d" stroke="#fff34b" strokeOpacity=".35" strokeWidth="2" />
      {avatar.id === "starter-fox" && <><path d="m25 43 4-27 22 20 20-20 5 28-7 23H32z" fill="#f28b43" stroke="#ffd16c" strokeWidth="2"/><path d="m30 24 15 14-15-4zm39 0L54 38l15-4z" fill="#8fdfff"/><path d="M35 50q15-13 30 0v13q-15 14-30 0z" fill="#ffe1b3"/><path d="m44 52 6 5 6-5" fill="none" stroke="#30202a" strokeWidth="3"/><path d="M32 43q18-11 36 0" fill="none" stroke="#42d5ff" strokeWidth="5"/></>}
      {avatar.id === "neon-raccoon" && <><path d="m28 42 1-19 17 12 9 0 17-12 1 20-6 24H34z" fill="#777483" stroke="#c6b4ff" strokeWidth="2"/><path d="M29 47q10-12 21-2 11-10 21 2l-4 10H33z" fill="#20202c"/><path d="M37 49h7m12 0h7" stroke="#62f4eb" strokeWidth="4" strokeLinecap="round"/><path d="M38 61q12 8 24 0" fill="none" stroke="#ff5cb8" strokeWidth="3"/><path d="M30 35h40" stroke="#ff5cb8" strokeWidth="4"/></>}
      {avatar.id === "astro-cat" && <><circle cx="50" cy="50" r="32" fill="#a9b5c9" fillOpacity=".2" stroke="#8deaff" strokeWidth="3"/><path d="m30 46 2-21 17 15 18-15 3 23-6 20H36z" fill="#b8c5d7" stroke="#e4f3ff" strokeWidth="2"/><path d="m36 50 8 2m12 0 8-2" stroke="#af72ff" strokeWidth="4" strokeLinecap="round"/><path d="m44 61 6 4 6-4" fill="none" stroke="#4bdfff" strokeWidth="2.5"/><circle cx="73" cy="30" r="2" fill="#fff34b"/><circle cx="25" cy="36" r="1.5" fill="#fff"/></>}
      {avatar.id === "cyber-gecko" && <><path d="M25 55q0-28 25-28t25 28q0 23-25 23T25 55" fill="#8ad94f" stroke="#d7ff82" strokeWidth="2"/><ellipse cx="37" cy="43" rx="9" ry="12" fill="#e9ff94"/><ellipse cx="63" cy="43" rx="9" ry="12" fill="#e9ff94"/><circle cx="38" cy="44" r="4" fill="#182333"/><circle cx="62" cy="44" r="4" fill="#182333"/><path d="M38 63q12 8 24 0" fill="none" stroke="#266b56" strokeWidth="3"/><path d="m28 55-8 8m52-8 8 8M34 70l-7 7m39-7 7 7" stroke="#59e7df" strokeWidth="3" strokeLinecap="round"/></>}
      {avatar.id === "shadow-raven" && <><path d="m28 63 5-29 12 12 6-24 8 24 14-13-1 33-13 13H39z" fill="#343143" stroke="#bd8cff" strokeWidth="2"/><path d="m50 53 23 4-21 13z" fill="#9862d8"/><path d="m40 48 8 2m8-2 8-2" stroke="#fff34b" strokeWidth="3" strokeLinecap="round"/><path d="M37 69q13 7 26-1" fill="none" stroke="#e2c8ff" strokeWidth="2"/><circle cx="23" cy="33" r="2" fill="#fff34b"/><circle cx="76" cy="28" r="2" fill="#fff34b"/></>}
      {avatar.id === "magma-dragon" && <><path d="m29 44-10-22 24 12 8-18 9 18 23-11-10 26v17L50 80 29 66z" fill="#30242e" stroke="#ff7b43" strokeWidth="3"/><path d="m31 23 10 12-13-4m34 4 10-11 3 9z" fill="#ff7138"/><path d="M36 51h9m10 0h9" stroke="#ffdc6c" strokeWidth="4" strokeLinecap="round"/><path d="m42 65 8 5 8-5" fill="none" stroke="#ff8c42" strokeWidth="3"/><path d="M23 72q-9-8-3-17m57 18q9-8 3-17" fill="none" stroke="#ff572e" strokeWidth="3"/></>}
      {avatar.id === "cosmic-wolf" && <><path d="m26 49 3-27 20 15 22-15 3 29-8 22H34z" fill="#334c76" stroke="#72d9ff" strokeWidth="2"/><path d="m30 28 14 12-12-4m37-8L55 40l12-4z" fill="#83d7ff"/><path d="m36 49 9 2m10 0 9-2" stroke="#8cf5ff" strokeWidth="4" strokeLinecap="round"/><path d="m42 62 8 12 8-12z" fill="#a9dafa"/><circle cx="39" cy="38" r="1.5" fill="#fff34b"/><circle cx="62" cy="32" r="2" fill="#fff"/><circle cx="70" cy="67" r="1.5" fill="#fff34b"/></>}
      {avatar.id === "aurora-koi" && <><path d="M20 54q12-28 40-20 15 4 21 19-10 16-29 17-20 0-32-16l-9 9 2-18z" fill="#f2f0e9" stroke="#8ef7f1" strokeWidth="2"/><path d="M42 38q15-10 21 4-2 13-18 12-12-7-3-16zm10 24q9-10 20-4-7 13-20 4z" fill="#ff814f"/><circle cx="68" cy="49" r="2.5" fill="#251925"/><path d="M82 53q10-9 9-17m-10 19q10 8 11 17" fill="none" stroke="#b68aff" strokeWidth="3" strokeLinecap="round"/><path d="M29 38q-8-12-5-18m2 41q-11 6-12 14" fill="none" stroke="#70e2e7" strokeWidth="3" strokeLinecap="round"/></>}
      {avatar.id === "celestial-knight" && <><path d="m30 31 20-13 20 13 6 26-11 22H35L24 57z" fill="#a9a8be" stroke="#fff0a0" strokeWidth="2.5"/><path d="m34 38 16-10 16 10-3 9H37z" fill="#4c3d68"/><path d="M36 52h28l-4 8H40z" fill="#fff34b"/><path d="m50 18 0-9m-20 23-7-6m47 6 7-6" stroke="#fff34b" strokeWidth="3" strokeLinecap="round"/><path d="M41 67h18" stroke="#7df4ff" strokeWidth="3" strokeLinecap="round"/></>}
      {avatar.id === "avatar-67" && <><path d="m27 43 5-22 18 12 18-12 5 22-7 29H34z" fill="#241b38" stroke="#fff34b" strokeWidth="2.5"/><path d="M34 48q8-10 16-1 8-9 16 1v9H34z" fill="#12101a"/><path d="M40 51h5m10 0h5" stroke="#5af6ff" strokeWidth="3" strokeLinecap="round"/><text x="50" y="75" textAnchor="middle" fill="#fff34b" fontSize="25" fontWeight="1000" fontFamily="Arial Black, sans-serif" stroke="#8f42ff" strokeWidth="1.2" paintOrder="stroke">67</text><path d="m23 30-7-5m61 4 6-7M25 76l-5 5m59-6 5 5" stroke="#fff34b" strokeWidth="2.5" strokeLinecap="round"/></>}
    </svg>
  );
}

function nameInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => Array.from(part)[0])
    .join("")
    .toUpperCase();
}

function AccountMenu({
  name,
  country,
  avatar,
  onSignOut,
}: {
  name: string;
  country: string;
  avatar: string | null;
  onSignOut: () => void;
}) {
  return (
    <details className="group relative shrink-0">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-white/10 bg-[#351e24] py-1 pl-1 pr-3 transition hover:border-white/25 hover:bg-[#40242c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fff34b] [&::-webkit-details-marker]:hidden">
        <span
          className="grid size-9 place-items-center overflow-hidden rounded-full border border-[#fff34b]/45 bg-[#392126] text-xs font-black text-[#fff34b]"
        >
          {avatar ? (
            <AvatarPortrait id={avatar} size={36} className="size-full object-cover" />
          ) : (
            nameInitials(name)
          )}
        </span>
        <span className="hidden max-w-32 truncate text-sm font-bold sm:block">
          {name}
        </span>
        <ChevronDown
          className="size-4 text-white/60 transition group-open:rotate-180"
          aria-hidden="true"
        />
        <span className="sr-only">Abrir menú de cuenta</span>
      </summary>
      <div className="absolute right-0 top-[calc(100%+0.65rem)] z-50 w-72 overflow-hidden rounded-2xl border border-white/15 bg-[#241519] shadow-[0_18px_50px_rgba(0,0,0,0.55)]">
        <div className="flex items-center gap-3 px-4 py-4">
          <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-[#fff34b]/45 bg-[#392126] text-lg font-black text-[#fff34b]">
            {avatar ? (
              <AvatarPortrait id={avatar} size={44} className="size-full object-cover" />
            ) : (
              nameInitials(name)
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate font-extrabold text-white">{name}</p>
            <p className="truncate text-sm text-rose-100/60">{country}</p>
          </div>
        </div>
        <div className="border-t border-white/10 p-2">
          <button
            type="button"
            onClick={onSignOut}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-bold text-white/85 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#fff34b]"
          >
            <LogOut className="size-4 text-[#fff34b]" aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </details>
  );
}

export default function GameHub({
  name,
  country,
  initialAvatar,
  initialCoins,
  onSignOut,
}: {
  name: string;
  country: string;
  initialAvatar: string | null;
  initialCoins: number;
  onSignOut: () => void;
}) {
  const [currentGame, setCurrentGame] = useState<GameId>(
    initialAvatar ? null : "store",
  );
  const [daysLeft, setDaysLeft] = useState(10);
  const [musicaActiva, setMusicaActiva] = useState(false);
  const [coins, setCoins] = useState(initialCoins);
  const [selectedCube, setSelectedCube] = useState<string | null>(
    normalizeAvatarId(initialAvatar),
  );

  const handleGameSelect = (game: GameId) => {
    if (game === "store") {
      setCoins(parseInt(localStorage.getItem("user-coins") || "0", 10));
      setSelectedCube(normalizeAvatarId(localStorage.getItem("user-cube")));
      setCurrentGame(game);
      return;
    }
    if (game === "friends") {
      setCurrentGame(game);
      return;
    }
    if (!localStorage.getItem("user-cube")) {
      alert("Antes de empezar tienes que ir a la tienda y escoger el avatar");
      handleGameSelect("store");
      return;
    }
    setCurrentGame(game);
  };

  useEffect(() => {
    const savedDate = localStorage.getItem("next-game-date");
    if (!savedDate) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 10);
      localStorage.setItem("next-game-date", targetDate.toISOString());
    }

    const next = new Date(localStorage.getItem("next-game-date") || "");
    const diffDays = Math.floor(
      (next.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    setDaysLeft(diffDays > 0 ? diffDays : 0);
  }, []);

  useEffect(() => {
    if (currentGame !== null || !musicaActiva) {
      detenerFunkLoop();
      return;
    }
    void reproducirFunkLoop().catch(() => setMusicaActiva(false));
    return detenerFunkLoop;
  }, [currentGame, musicaActiva]);

  const renderGame = (game: ReactNode) => (
    <>
      {game}
      <button
        type="button"
        onClick={() => setCurrentGame(null)}
        className="fixed left-4 top-4 z-[1000] inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-[#241519]/95 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur transition hover:bg-[#392126] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fff34b]"
      >
        <House className="size-4 text-[#fff34b]" aria-hidden="true" />
        Volver al hub
      </button>
    </>
  );

  if (currentGame === "hangman") {
    return renderGame(<HangmanGameWrapper />);
  }
  if (currentGame === "tiragol") {
    return renderGame(<Tiragol onBack={() => setCurrentGame(null)} />);
  }
  if (currentGame === "noledes") {
    return renderGame(<NoLeDesOPegale />);
  }
  if (currentGame === "airhockey") {
    return renderGame(<AirHockey />);
  }
  if (currentGame === "botecolor") {
    return renderGame(<Botecolor />);
  }
  if (currentGame === "pinpon") {
    return renderGame(<PinPon />);
  }
  if (currentGame === "radiotricky") {
    return renderGame(<Radiotricky />);
  }

  if (currentGame === "friends") {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-8 bg-zinc-900 text-white">
        <h1 className="text-6xl font-black italic">
          MODO <span className="text-blue-500">AMIGOS</span>
        </h1>
        <p className="text-xl text-zinc-400">
          Pronto podrás jugar contra tus amigos en tiempo real.
        </p>
        <button
          onClick={() => setCurrentGame(null)}
          className="rounded-xl bg-blue-600 px-8 py-3 font-bold hover:bg-blue-500"
        >
          Volver al Hub
        </button>
      </div>
    );
  }

  if (currentGame === "store") {
    return (
      <div className="min-h-screen w-full bg-[#170d12] text-white">
        <header className="flex min-h-20 items-center justify-between border-b border-white/10 bg-[#241318] px-5 sm:px-10">
          <button
            onClick={() => setCurrentGame(null)}
            disabled={!selectedCube}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-white/75 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5ee23] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowRight className="size-4 rotate-180" aria-hidden="true" />
            {selectedCube ? "Volver al hub" : "Elige un avatar para continuar"}
          </button>
          <div className="flex items-center gap-3">
            <AccountMenu
              name={name}
              country={country}
              avatar={selectedCube}
              onSignOut={onSignOut}
            />
            <div className="inline-flex items-center gap-2 rounded-full bg-[#392126] px-4 py-2 font-extrabold tabular-nums text-[#fff34b]">
              <Coins className="size-5" aria-hidden="true" />
              {coins.toLocaleString("es-CO")}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-10 sm:px-10 sm:pt-14">
          <section className="relative mb-12 grid min-h-[260px] overflow-hidden rounded-[20px] bg-[#391923] md:grid-cols-[1.1fr_0.9fr]">
            <div className="relative z-10 flex flex-col items-start justify-center p-7 sm:p-10 lg:p-14">
              <h1 className="max-w-xl text-4xl font-black leading-[0.98] tracking-[-0.035em] sm:text-6xl">
                Tu skin. <span className="text-[#fff34b]">Tu estilo.</span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-rose-100/75 sm:text-lg">
                Elige el avatar que te acompaña en cada partida.
              </p>
            </div>
            <div className="relative min-h-56 md:min-h-full">
              <Image
                src="/game-covers/cover-8.webp"
                alt="Un avatar rodeado de monedas y objetos brillantes"
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#391923] via-[#391923]/35 to-transparent md:bg-gradient-to-l md:from-transparent md:via-transparent md:to-[#391923]" />
              {selectedCube && (
                <div className="absolute bottom-5 right-5 flex items-center gap-3 rounded-xl bg-[#1a1014]/90 px-4 py-3 shadow-xl">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/65">
                    Tu avatar
                  </span>
                  <AvatarPortrait
                    id={selectedCube}
                    size={52}
                    className="size-13 rounded-xl object-cover"
                  />
                </div>
              )}
            </div>
          </section>

          <section aria-labelledby="avatars-heading">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2
                  id="avatars-heading"
                  className="text-3xl font-black tracking-[-0.03em] sm:text-4xl"
                >
                  Elige tu skin
                </h2>
                <p className="mt-2 text-sm text-rose-100/65 sm:text-base">
                  Escoge uno para desbloquear tus juegos.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-white/55">
                <Check className="size-4 text-[#fff34b]" aria-hidden="true" />
                {selectedCube
                  ? "Tu elección queda guardada"
                  : "Tu primer avatar es gratis"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {avatars.map((avatar) => {
                const selected = selectedCube === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      if (coins < avatar.price) {
                        alert("No tienes suficientes monedas");
                        return;
                      }
                      localStorage.setItem("user-cube", avatar.id);
                      const nextCoins =
                        avatar.price > 0 ? coins - avatar.price : coins;
                      if (avatar.price > 0) {
                        localStorage.setItem(
                          "user-coins",
                          nextCoins.toString(),
                        );
                        setCoins(nextCoins);
                      }
                      setSelectedCube(avatar.id);
                      alert(`Has elegido el avatar ${avatar.name}`);
                    }}
                    className={`group relative flex min-h-48 flex-col items-start justify-between overflow-hidden rounded-2xl bg-[#28161c] p-4 text-left transition duration-200 hover:-translate-y-1 hover:bg-[#382027] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fff34b] sm:min-h-56 sm:p-5 ${selected ? "ring-2 ring-[#fff34b]" : ""}`}
                  >
                    <span className="absolute right-4 top-4 rounded-full bg-black/30 px-2.5 py-1 text-xs font-bold tabular-nums text-[#fff34b]">
                      {avatar.price === 0 ? (
                        "Gratis"
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <Coins className="size-3.5" aria-hidden="true" />
                          {avatar.price.toLocaleString("es-CO")}
                        </span>
                      )}
                    </span>
                    {selected && (
                      <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-[#fff34b] px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-[#241318]">
                        <Check className="size-3" aria-hidden="true" />
                        Elegido
                      </span>
                    )}
                    <span
                      className={`avatar-tier-${avatar.tier} ${avatar.id === "avatar-67" ? "avatar-ultimate" : ""} mt-9 grid size-20 place-items-center overflow-hidden rounded-2xl bg-[#45262e] shadow-[0_10px_30px_rgba(0,0,0,0.22)] transition group-hover:scale-105 sm:size-24 ${selected ? "ring-2 ring-[#fff34b]" : ""}`}
                    >
                      <AvatarPortrait
                        id={avatar.id}
                        size={96}
                        className="avatar-portrait size-full object-cover"
                      />
                    </span>
                    <span className="mt-5 flex w-full items-center justify-between gap-2">
                      <span className="truncate text-lg font-extrabold sm:text-xl">
                        {avatar.name}
                      </span>
                      <span className="shrink-0 text-[10px] font-black uppercase tracking-wider text-white/45">
                        {avatar.id === "avatar-67"
                          ? "Ultra 67"
                          : tierLabels[avatar.tier]}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#180e13] text-white selection:bg-[#fff34b] selection:text-[#180e13]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#241519]">
        <nav
          aria-label="Navegación principal"
          className="mx-auto flex min-h-[72px] max-w-[1600px] items-center gap-6 px-4 sm:px-8"
        >
          <a
            href="#inicio"
            aria-label="Game Hub, inicio"
            className="inline-flex shrink-0 items-center gap-2 text-xl font-black uppercase tracking-[-0.045em] sm:gap-2.5 sm:text-2xl"
          >
            <svg
              viewBox="0 0 48 48"
              className="size-9 shrink-0 sm:size-10"
              aria-hidden="true"
            >
              <path
                d="M24 3.5 43.5 10v18.5c0 7.2-7.3 12.2-19.5 16C11.8 40.7 4.5 35.7 4.5 28.5V10L24 3.5Z"
                fill="#351923"
                stroke="#fff34b"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path
                d="M21 16h-3.5a6.5 6.5 0 1 0 0 13H21v-5.5h-4"
                fill="none"
                stroke="#fff34b"
                strokeWidth="3.5"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />
              <path
                d="M28 16v13m10-13v13m-10-6.5h10"
                fill="none"
                stroke="#fff"
                strokeWidth="3.5"
                strokeLinecap="square"
              />
            </svg>
            Game<span className="text-[#fff34b]">Hub</span>
          </a>
          <div className="hidden items-center gap-6 text-sm font-bold text-white/70 md:flex">
            <a className="transition hover:text-white" href="#inicio">
              Descubrir
            </a>
            <a className="transition hover:text-white" href="#juegos">
              Juegos
            </a>
            <a className="transition hover:text-white" href="#extras">
              Más
            </a>
          </div>
          <a
            href="#juegos"
            className="ml-auto hidden h-11 max-w-[430px] flex-1 items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-4 text-sm text-white/50 transition hover:border-white/30 hover:text-white/75 md:flex"
          >
            <Gamepad2 className="size-[18px]" aria-hidden="true" />
            ¿A qué jugamos hoy?
          </a>
          <button
            onClick={() => handleGameSelect("friends")}
            className="hidden items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-bold transition hover:bg-white/15 sm:inline-flex"
          >
            <UsersRound className="size-4" aria-hidden="true" />
            Amigos
          </button>
          <label className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-full bg-[#351e24] px-3 py-2 text-xs font-bold text-white/85 md:ml-0 sm:gap-3 sm:px-4 sm:text-sm">
            <Music2
              className="hidden size-4 text-[#fff34b] sm:block"
              aria-hidden="true"
            />
            <span className="hidden sm:inline">Música</span>
            <VolumeX
              className={`size-4 transition ${musicaActiva ? "text-white/35" : "text-[#fff34b]"}`}
              aria-hidden="true"
            />
            <Switch
              checked={musicaActiva}
              onCheckedChange={setMusicaActiva}
              aria-label={musicaActiva ? "Apagar música" : "Encender música"}
              className="data-checked:bg-[#fff34b] data-unchecked:bg-white/25"
            />
            <Volume2
              className={`size-4 transition ${musicaActiva ? "text-[#fff34b]" : "text-white/35"}`}
              aria-hidden="true"
            />
          </label>
          <button
            onClick={() => handleGameSelect("store")}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#fff34b] text-[#23151a] transition hover:bg-[#fff877] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-11 sm:w-auto sm:gap-2 sm:rounded-full sm:px-5 sm:text-sm sm:font-black"
            aria-label="Ir a la tienda"
          >
            <ShoppingBag className="size-[18px]" aria-hidden="true" />
            <span className="hidden sm:inline">Tienda</span>
          </button>
          <AccountMenu
            name={name}
            country={country}
            avatar={selectedCube}
            onSignOut={onSignOut}
          />
        </nav>
      </header>

      <main
        id="inicio"
        className="mx-auto max-w-[1600px] px-4 pb-12 pt-7 sm:px-8 sm:pt-10"
      >
        <section
          className="border-b border-white/10 pb-6"
          aria-labelledby="intro-heading"
        >
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#fff34b]">
            Un mundo de juegos para compartir
          </p>
          <h1
            id="intro-heading"
            className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-5xl"
          >
            ¿A qué jugamos hoy?
          </h1>
          <p className="mt-2 text-sm text-rose-100/65 sm:text-base">
            Retos cortos para reír, pensar y jugar en familia.
          </p>
        </section>

        <section
          id="juegos"
          className="scroll-mt-24 pt-7 sm:pt-9"
          aria-labelledby="games-heading"
        >
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2
              id="games-heading"
              className="text-3xl font-black tracking-[-0.035em] sm:text-4xl"
            >
              Juegos para descubrir
            </h2>
          </div>

          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:gap-5 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 xl:grid-cols-4">
            {games.map((game) => (
              <button
                key={game.id}
                type="button"
                onClick={() => handleGameSelect(game.id)}
                className="group w-[82vw] shrink-0 snap-start text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fff34b] sm:w-[46vw] lg:w-auto"
              >
                <span className="relative block aspect-[16/9] overflow-hidden rounded-[14px] bg-[#321a20]">
                  <Image
                    src={game.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 82vw, (max-width: 1024px) 46vw, 25vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.045]"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-[#1b1116]/85 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-sm">
                    {game.label}
                  </span>
                  <span className="absolute bottom-3 right-3 grid size-10 translate-y-1 place-items-center rounded-full bg-[#fff34b] text-[#241318] opacity-0 shadow-lg transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    <ArrowUpRight className="size-5" aria-hidden="true" />
                  </span>
                </span>
                <span className="mt-3 block text-xl font-extrabold tracking-[-0.02em] transition group-hover:text-[#fff34b]">
                  {game.title}
                </span>
                <span className="mt-1 block text-sm leading-5 text-rose-100/60">
                  {game.description}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section
          id="extras"
          className="scroll-mt-24 grid gap-4 pt-14 sm:pt-16 lg:grid-cols-[1.4fr_0.6fr]"
          aria-label="Más para descubrir"
        >
          <button
            onClick={() => handleGameSelect("store")}
            className="group relative flex min-h-60 overflow-hidden rounded-[18px] bg-[#3c1d28] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fff34b]"
          >
            <div className="relative z-10 flex w-[65%] flex-col items-start justify-center p-6 sm:p-9">
              <h2 className="max-w-sm text-3xl font-black leading-[1.02] tracking-[-0.035em] sm:text-4xl">
                Dale personalidad a tu partida.
              </h2>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#fff34b]">
                Explorar la tienda{" "}
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </div>
            <div className="absolute inset-y-0 right-0 w-[58%]">
              <Image
                src="/game-covers/cover-8.webp"
                alt=""
                fill
                sizes="(max-width: 1024px) 60vw, 35vw"
                className="object-cover transition duration-300 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#3c1d28] via-[#3c1d28]/40 to-transparent" />
            </div>
          </button>
          <button
            onClick={() => handleGameSelect("friends")}
            className="group flex min-h-60 flex-col justify-between rounded-[18px] bg-[#291a32] p-6 text-left transition hover:bg-[#372343] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fff34b] sm:p-8"
          >
            <UsersRound className="size-8 text-[#d49bff]" aria-hidden="true" />
            <span>
              <span className="block text-2xl font-black tracking-[-0.025em]">
                ¿Quién se apunta?
              </span>
              <span className="mt-2 block text-sm leading-6 text-purple-100/65">
                El modo para jugar con amigos está en camino.
              </span>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#d49bff]">
                Ver modo amigos{" "}
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </span>
          </button>
        </section>

        <section className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-rose-100/55 sm:flex-row sm:items-center sm:justify-between">
          <p>Próximo juego en {daysLeft} días</p>
          <p>por: ernesto pinzon</p>
          <p>
            Música:{" "}
            <a
              className="underline underline-offset-2 hover:text-white"
              href="https://pixabay.com/music/synthwave-green-sky-125179/"
              target="_blank"
              rel="noreferrer"
            >
              Green Sky — DSTechnician · Pixabay
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}
