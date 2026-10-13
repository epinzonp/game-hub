"use client";

import { useCallback, useState } from "react";
import HangmanGame, { type Resultado } from "./HangmanGame";
import HangmanLeaderboard from "./HangmanLeaderboard";
import GameEntryScreen from "./GameEntryScreen";
import { PALABRAS, type Palabra } from "@/lib/palabras";
import { reproducirMelodiaTriste } from "@/lib/sonido";

type Screen = "hub" | "playing" | "end" | "country-selection";

type LocalScore = { name: string; country: string; points: number };

function isLocalScore(value: unknown): value is LocalScore {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof value.name === "string" &&
    "country" in value &&
    typeof value.country === "string" &&
    "points" in value &&
    typeof value.points === "number" &&
    Number.isSafeInteger(value.points) &&
    value.points >= 0
  );
}

interface Dificultad {
  nombre: string;
  errores: number;
  longMin: number;
}

function dificultadDeRacha(racha: number): Dificultad {
  if (racha >= 10) return { nombre: "Extremo", errores: 3, longMin: 8 };
  if (racha >= 5) return { nombre: "Difícil", errores: 4, longMin: 7 };
  if (racha >= 2) return { nombre: "Normal", errores: 5, longMin: 6 };
  return { nombre: "Fácil", errores: 6, longMin: 4 };
}

function elegirPalabra(longMin: number): Palabra {
  const candidatas = PALABRAS.filter((p) => p.palabra.trim().length >= longMin);
  const pool = candidatas.length ? candidatas : PALABRAS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function HangmanGameWrapper({
  name,
  country: playerCountry,
  onWin,
}: {
  name: string;
  country: string;
  onWin: () => Promise<void>;
}) {
  const [screen, setScreen] = useState<Screen>("hub");
  const [palabra, setPalabra] = useState<Palabra | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [mostrarAyuda, setMostrarAyuda] = useState(false);
  const [racha, setRacha] = useState(0);
  const [rewardError, setRewardError] = useState("");
  const dificultad = dificultadDeRacha(racha);

  const jugar = useCallback(() => {
    setRewardError("");
    setPalabra(elegirPalabra(dificultad.longMin));
    setResultado(null);
    setScreen("playing");
  }, [dificultad.longMin]);

  const updateScore = useCallback(() => {
    const profile = { name, country: playerCountry };

    const saved = localStorage.getItem("hangman-scores");
    const scores: unknown = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(scores) || !scores.every(isLocalScore))
      throw new Error("La tabla local no es válida.");
    const index = scores.findIndex((score) => score.name === profile.name);

    if (index > -1) {
      scores[index].points += 1;
    } else {
      scores.push({
        name: profile.name,
        country: profile.country,
        points: 1,
      });
    }
    localStorage.setItem("hangman-scores", JSON.stringify(scores));
  }, [name, playerCountry]);

  const onFinish = useCallback(
    (r: Resultado) => {
      if (!r.ganaste) reproducirMelodiaTriste();
      setRacha((prev) => (r.ganaste ? prev + 1 : 0));
      setResultado(r);

      if (r.ganaste) {
        void onWin().catch(() =>
          setRewardError(
            "No pudimos guardar las monedas de esta victoria. Revisa tu conexión.",
          ),
        );
        try {
          updateScore();
        } catch {
          setRewardError("No pudimos actualizar la tabla local de victorias.");
        }
        setScreen("end");
      } else {
        setScreen("end");
      }
    },
    [onWin, updateScore],
  );

  if (screen === "playing" && palabra) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
        <HangmanGame
          palabra={palabra}
          onFinish={onFinish}
          maxErrores={dificultad.errores}
          dificultad={dificultad.nombre}
          racha={racha}
        />
      </div>
    );
  }

  if (screen === "end" && resultado) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 p-4 text-center">
        <h2
          className={`text-5xl font-black tracking-tight ${
            resultado.ganaste ? "text-green-400" : "text-red-500"
          }`}
        >
          {resultado.ganaste ? "¡GANASTE!" : "PERDISTE"}
        </h2>
        <p className="text-zinc-300">
          {resultado.ganaste
            ? "Salvaste al muñeco del ahorcado."
            : "El muñeco cayó en la lava..."}
        </p>
        {rewardError && (
          <p role="alert" className="text-sm text-rose-200">
            {rewardError}
          </p>
        )}
        <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-8 py-5">
          <span className="text-xs uppercase tracking-widest text-amber-400">
            {resultado.categoria}
          </span>
          <span className="text-4xl font-bold tracking-widest text-white">
            {resultado.palabra.toUpperCase()}
          </span>
          <span className="max-w-md text-sm italic text-zinc-400">
            {resultado.pista}
          </span>
        </div>
        <div className="flex flex-col items-center gap-6">
          <div className="text-sm text-zinc-400">
            Racha de victorias:{" "}
            <span className="font-bold text-green-400">{racha}</span>
          </div>
          <HangmanLeaderboard />
        </div>
        <div className="flex gap-3">
          <button
            onClick={jugar}
            className="rounded-xl bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-transform hover:scale-105"
          >
            Jugar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <GameEntryScreen
      title="El Ahorcado"
      description="Adivina la palabra antes de que el muñeco caiga en la lava."
      image="/game-covers/cover-0.webp"
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <HangmanLeaderboard />

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={jugar}
            className="min-h-12 rounded-xl bg-[#fff34b] px-12 py-4 text-2xl font-black text-[#180e13] shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            JUGAR
          </button>
          <button
            onClick={() => setMostrarAyuda((v) => !v)}
            className="text-sm text-zinc-400 underline hover:text-zinc-200"
          >
            {mostrarAyuda ? "Ocultar cómo jugar" : "Cómo jugar"}
          </button>
        </div>

        {mostrarAyuda && (
          <div className="max-w-lg rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 text-left text-sm text-zinc-300">
            <ul className="list-inside list-disc space-y-1.5">
              <li>
                Se te muestra una <b>categoría</b> y una <b>pista</b>.
              </li>
              <li>Adivina la palabra letra por letra (teclado o botones).</li>
              <li>Cada letra equivocada dibuja una parte del muñeco.</li>
              <li>
                Si agotas los errores, el muñeco <b>cae en la lava</b>. ¡No lo
                dejes!
              </li>
              <li>Las tildes no cuentan (á = a) y la ñ sí se usa.</li>
              <li>
                <b>¡Ojo!</b> Cada victoria seguida sube la dificultad: menos
                errores y palabras más largas. La racha se reinicia si pierdes.
              </li>
            </ul>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center rounded-xl border border-white/10 bg-[#180e13]/65 px-4 py-3 text-sm text-rose-100/75">
          <span className="mr-2">Dificultad:</span>
          <span className="font-bold text-green-400">Fácil</span>
          <span className="mx-2 text-zinc-600">→</span>
          <span className="font-bold text-yellow-400">Normal</span>
          <span className="mx-2 text-zinc-600">→</span>
          <span className="font-bold text-orange-400">Difícil</span>
          <span className="mx-2 text-zinc-600">→</span>
          <span className="font-bold text-red-500">Extremo</span>
        </div>
      </div>
    </GameEntryScreen>
  );
}
