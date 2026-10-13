"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { ConvexError } from "convex/values";
import { avatars, normalizeAvatarId } from "@/lib/avatars";
import type { GameRouteId } from "@/lib/game-routes";
import { useGameNavigation } from "./GameNavigationGuard";
import AvatarSetupDialog from "./AvatarSetupDialog";
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
  Trophy,
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

type GameId = GameRouteId | "friends" | "store" | "profile" | null;

export const games = [
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

const avatarById = Object.fromEntries(
  avatars.map((avatar) => [avatar.id, avatar]),
);
const tierLabels: Record<string, string> = {
  starter: "Inicial",
  rare: "Raro",
  epic: "Épico",
  legendary: "Legendario",
  mythic: "Mítico",
};

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
    <Image
      src={`/avatars/${avatar.id}.webp`}
      alt={avatar.name}
      width={size}
      height={size}
      className={className}
    />
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
  coins,
  maxCoins,
  onSignOut,
}: {
  name: string;
  country: string;
  avatar: string | null;
  coins: number;
  maxCoins: number;
  onSignOut: () => void;
}) {
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (
        !(event.target instanceof Node) ||
        !menuRef.current?.contains(event.target)
      ) {
        menuRef.current?.removeAttribute("open");
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  return (
    <details ref={menuRef} className="group relative shrink-0 md:ml-auto">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-white/10 bg-[#351e24] py-1 pl-1 pr-3 transition hover:border-white/25 hover:bg-[#40242c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fff34b] [&::-webkit-details-marker]:hidden">
        <span className="grid size-9 place-items-center overflow-hidden rounded-full border border-[#fff34b]/45 bg-[#392126] text-xs font-black text-[#fff34b]">
          {avatar ? (
            <AvatarPortrait
              id={avatar}
              size={36}
              className="size-full object-cover"
            />
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
              <AvatarPortrait
                id={avatar}
                size={44}
                className="size-full object-cover"
              />
            ) : (
              nameInitials(name)
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate font-extrabold text-white">{name}</p>
            <p className="truncate text-sm text-rose-100/60">{country}</p>
          </div>
        </div>
        <dl className="grid gap-3 border-t border-white/10 px-4 py-4 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-rose-100/70">Monedas actuales</dt>
            <dd className="font-extrabold tabular-nums text-[#fff34b]">
              {coins.toLocaleString("es-CO")}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-rose-100/70">Máximo alcanzado</dt>
            <dd className="font-extrabold tabular-nums text-[#fff34b]">
              {maxCoins.toLocaleString("es-CO")}
            </dd>
          </div>
        </dl>
        <div className="border-t border-white/10 p-2">
          <Link
            href="/profile"
            className="flex min-h-11 w-full items-center rounded-xl px-3 text-sm font-bold text-white/85 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#fff34b]"
          >
            Mi perfil
          </Link>
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
  maxCoins,
  ownedAvatars,
  initialGame,
  onSignOut,
  onPurchase,
  onWin,
  startInStore = false,
  startInProfile = false,
}: {
  name: string;
  country: string;
  initialAvatar: string | null;
  initialCoins: number;
  maxCoins: number;
  ownedAvatars: string[];
  initialGame?: GameRouteId;
  onSignOut: () => void;
  onPurchase: (avatar: string) => Promise<void>;
  onWin: () => Promise<void>;
  startInStore?: boolean;
  startInProfile?: boolean;
}) {
  const router = useRouter();
  const requestNavigation = useGameNavigation();
  const [currentGame, setCurrentGame] = useState<GameId>(
    initialGame ??
      (startInProfile
        ? "profile"
        : !initialAvatar
          ? "store"
          : startInStore
            ? "store"
            : null),
  );
  const [musicaActiva, setMusicaActiva] = useState(false);
  const coins = initialCoins;
  const selectedCube = normalizeAvatarId(initialAvatar);
  const ownedAvatarIds = new Set(ownedAvatars);
  const [purchasePending, setPurchasePending] = useState(false);
  const [purchaseError, setPurchaseError] = useState("");
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const selectAvatar = async (avatarId: string) => {
    const avatar = avatarById[avatarId as keyof typeof avatarById];
    if (!avatar || purchasePending) return;
    if (!ownedAvatarIds.has(avatar.id) && coins < avatar.price) {
      alert("No tienes suficientes monedas");
      return;
    }
    setPurchasePending(true);
    setPurchaseError("");
    try {
      await onPurchase(avatar.id);
      setPreviewAvatar(null);
    } catch (error) {
      setPurchaseError(
        error instanceof ConvexError && typeof error.data === "string"
          ? error.data
          : "No pudimos guardar tu avatar. Inténtalo de nuevo.",
      );
    } finally {
      setPurchasePending(false);
    }
  };

  const handleGameSelect = (game: GameId) => {
    if (game === "store") {
      router.push("/store");
      return;
    }
    if (game === "friends") {
      setCurrentGame(game);
      return;
    }
    if (!selectedCube) {
      alert("Antes de empezar tienes que ir a la tienda y escoger el avatar");
      handleGameSelect("store");
      return;
    }
    router.push(`/games/${game}`);
  };

  useEffect(() => {
    if (currentGame !== null || !musicaActiva) {
      detenerFunkLoop();
      return;
    }
    void reproducirFunkLoop().catch(() => setMusicaActiva(false));
    return detenerFunkLoop;
  }, [currentGame, musicaActiva]);

  useEffect(() => {
    if (initialGame && !selectedCube) router.replace("/store");
  }, [initialGame, router, selectedCube]);

  if (initialGame && !selectedCube) {
    return (
      <p role="status" className="p-10 text-center text-white">
        Abriendo la tienda…
      </p>
    );
  }

  const renderGame = (game: ReactNode) => (
    <>
      {game}
      <button
        type="button"
        onClick={() => requestNavigation("/")}
        className="fixed left-4 top-4 z-[1000] inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-[#241519]/95 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur transition hover:bg-[#392126] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fff34b]"
      >
        <House className="size-4 text-[#fff34b]" aria-hidden="true" />
        Volver al hub
      </button>
    </>
  );

  if (currentGame === "hangman") {
    return renderGame(
      <HangmanGameWrapper name={name} country={country} onWin={onWin} />,
    );
  }
  if (currentGame === "tiragol") {
    return renderGame(<Tiragol onBack={() => requestNavigation("/")} />);
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
          {selectedCube ? (
            <button
              onClick={() => {
                setCurrentGame(null);
                router.push("/");
              }}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-white/75 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5ee23] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowRight className="size-4 rotate-180" aria-hidden="true" />
              Volver al hub
            </button>
          ) : (
            <span className="text-sm font-bold text-[#fff34b]">
              Tu primer avatar
            </span>
          )}
          <div className="flex items-center gap-3">
            <AccountMenu
              name={name}
              country={country}
              avatar={selectedCube}
              coins={coins}
              maxCoins={maxCoins}
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
                    onClick={() => setPreviewAvatar(avatar.id)}
                    className={`group relative flex min-h-48 flex-col items-start justify-between overflow-hidden rounded-2xl bg-[#28161c] p-4 text-left transition duration-200 hover:-translate-y-1 hover:bg-[#382027] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fff34b] sm:min-h-56 sm:p-5 ${selected ? "ring-2 ring-[#fff34b]" : ""}`}
                  >
                    <span className="absolute right-4 top-4 rounded-full bg-black/30 px-2.5 py-1 text-xs font-bold tabular-nums text-[#fff34b]">
                      {ownedAvatarIds.has(avatar.id) ? (
                        "Lo tienes"
                      ) : avatar.price === 0 ? (
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
        {!selectedCube && (
          <AvatarSetupDialog
            coins={coins}
            onSignOut={onSignOut}
            onChoose={async (avatar) => {
              await onPurchase(avatar);
              setCurrentGame(null);
              router.push("/");
            }}
          />
        )}
        {previewAvatar &&
          avatarById[previewAvatar as keyof typeof avatarById] && (
            <div
              className="fixed inset-0 z-50 grid place-items-center bg-[#10090d]/80 p-4 backdrop-blur-sm"
              onPointerDown={(event) => {
                if (event.target === event.currentTarget) {
                  setPreviewAvatar(null);
                }
              }}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="avatar-preview-title"
                className="relative w-full max-w-md rounded-3xl border border-white/15 bg-[#241519] p-6 text-center shadow-2xl"
              >
                <button
                  type="button"
                  onClick={() => setPreviewAvatar(null)}
                  className="absolute right-4 top-4 rounded-full px-3 py-1 text-xl text-white/60 hover:bg-white/10 hover:text-white"
                  aria-label="Cerrar vista previa"
                >
                  ×
                </button>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#fff34b]">
                  Vista previa
                </p>
                <h2
                  id="avatar-preview-title"
                  className="mt-2 text-3xl font-black"
                >
                  {avatarById[previewAvatar as keyof typeof avatarById].name}
                </h2>
                <div className="mx-auto my-5 grid size-64 place-items-center rounded-3xl bg-[#180e13] p-4">
                  <AvatarPortrait
                    id={previewAvatar}
                    size={240}
                    className="size-full object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => void selectAvatar(previewAvatar)}
                  disabled={purchasePending || selectedCube === previewAvatar}
                  className="min-h-12 w-full rounded-xl bg-[#fff34b] px-5 font-black text-[#180e13] transition hover:bg-[#fff877] disabled:cursor-default disabled:opacity-60"
                >
                  {purchasePending
                    ? "Guardando…"
                    : selectedCube === previewAvatar
                      ? "Avatar seleccionado"
                      : ownedAvatarIds.has(previewAvatar)
                        ? "Usar avatar"
                        : avatarById[previewAvatar as keyof typeof avatarById]
                              .price === 0
                          ? "Elegir gratis"
                          : `Comprar por ${avatarById[previewAvatar as keyof typeof avatarById].price.toLocaleString("es-CO")} monedas`}
                </button>
                {purchaseError && (
                  <p role="alert" className="mt-3 text-sm text-rose-200">
                    {purchaseError}
                  </p>
                )}
              </div>
            </div>
          )}
      </div>
    );
  }

  if (currentGame === "profile") {
    return (
      <div className="min-h-screen w-full bg-[#180e13] text-white">
        <header className="flex min-h-20 items-center justify-between border-b border-white/10 bg-[#241519] px-5 sm:px-10">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-bold text-white/75 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fff34b]"
          >
            <ArrowRight className="size-4 rotate-180" aria-hidden="true" />
            Volver al hub
          </Link>
          <div className="flex items-center gap-3">
            <AccountMenu
              name={name}
              country={country}
              avatar={selectedCube}
              coins={coins}
              maxCoins={maxCoins}
              onSignOut={onSignOut}
            />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-10 sm:px-10 sm:py-14">
          <section className="mb-10 flex flex-wrap items-center gap-5 rounded-3xl border border-white/10 bg-[#241519] p-6 sm:p-8">
            <span className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[#fff34b]/45 bg-[#392126] text-3xl font-black text-[#fff34b]">
              {selectedCube ? (
                <AvatarPortrait
                  id={selectedCube}
                  size={96}
                  className="size-full object-cover"
                />
              ) : (
                nameInitials(name)
              )}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                {name}
              </h1>
              <p className="mt-1 text-rose-100/65">{country}</p>
            </div>
            <dl className="grid min-w-52 gap-3 rounded-2xl bg-[#180e13] px-5 py-4 text-sm">
              <div className="flex items-center justify-between gap-5">
                <dt className="text-rose-100/65">Monedas actuales</dt>
                <dd className="font-extrabold tabular-nums text-[#fff34b]">
                  {coins.toLocaleString("es-CO")}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-5">
                <dt className="text-rose-100/65">Máximo alcanzado</dt>
                <dd className="font-extrabold tabular-nums text-[#fff34b]">
                  {maxCoins.toLocaleString("es-CO")}
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="owned-avatars-heading">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2
                  id="owned-avatars-heading"
                  className="text-2xl font-black sm:text-3xl"
                >
                  Tus avatares
                </h2>
                <p className="mt-2 text-sm text-rose-100/65">
                  Cambia de avatar cuando quieras. Los que ya tienes son gratis.
                </p>
              </div>
              <Link
                href="/store"
                className="inline-flex min-h-11 items-center rounded-xl bg-[#fff34b] px-5 text-sm font-black text-[#180e13] transition hover:bg-[#fff877] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Visitar la tienda
              </Link>
            </div>

            {ownedAvatars.length ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {avatars
                  .filter((avatar) => ownedAvatarIds.has(avatar.id))
                  .map((avatar) => {
                    const selected = selectedCube === avatar.id;
                    return (
                      <article
                        key={avatar.id}
                        className={`rounded-2xl border bg-[#241519] p-4 ${selected ? "border-[#fff34b]" : "border-white/10"}`}
                      >
                        <div
                          className={`avatar-tier-${avatar.tier} ${avatar.id === "avatar-67" ? "avatar-ultimate" : ""} mx-auto grid aspect-square w-full max-w-48 place-items-center overflow-hidden rounded-2xl bg-[#392126]`}
                        >
                          <AvatarPortrait
                            id={avatar.id}
                            size={192}
                            className="avatar-portrait size-full object-cover"
                          />
                        </div>
                        <h3 className="mt-4 text-center text-lg font-extrabold">
                          {avatar.name}
                        </h3>
                        <button
                          type="button"
                          aria-pressed={selected}
                          disabled={selected || purchasePending}
                          onClick={() => void selectAvatar(avatar.id)}
                          className="mt-3 min-h-11 w-full rounded-xl bg-[#fff34b] px-3 text-sm font-black text-[#180e13] transition hover:bg-[#fff877] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-default disabled:bg-white/10 disabled:text-white/65"
                        >
                          {selected ? "En uso" : "Usar avatar"}
                        </button>
                      </article>
                    );
                  })}
              </div>
            ) : (
              <p className="rounded-2xl border border-white/10 bg-[#241519] p-6 text-rose-100/70">
                Aún no tienes avatares. Visita la tienda para elegir el primero.
              </p>
            )}
            {purchaseError && (
              <p role="alert" className="mt-4 text-sm text-rose-200">
                {purchaseError}
              </p>
            )}
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
          className="mx-auto flex min-h-[72px] max-w-[1600px] flex-wrap items-center gap-2 px-4 py-3 sm:gap-4 sm:px-8 2xl:flex-nowrap"
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
            className="ml-auto hidden h-11 max-w-[430px] flex-1 items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-4 text-sm text-white/50 transition hover:border-white/30 hover:text-white/75 2xl:flex"
          >
            <Gamepad2 className="size-[18px]" aria-hidden="true" />
            ¿A qué jugamos hoy?
          </a>
          <Link
            href="/leaderboard"
            aria-label="Clasificación"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-[#b695ff]/45 bg-[#291a32] px-3 text-sm font-bold text-[#d7bcff] transition hover:bg-[#372343] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fff34b] lg:px-4"
          >
            <Trophy className="size-4" aria-hidden="true" />
            <span className="hidden lg:inline">Clasificación</span>
          </Link>
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
            coins={coins}
            maxCoins={maxCoins}
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
                    src={`${game.image}?v=2`}
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
          <p className="credit-rainbow">
            <span>Por: Ernesto Pinzón</span>
          </p>
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
