"use client";

import { useCallback, useEffect, useState } from "react";
import HangmanGame, { type Resultado } from "./HangmanGame";
import HangmanLeaderboard from "./HangmanLeaderboard";
import { PALABRAS, type Palabra } from "@/lib/palabras";
import { reproducirMelodiaTriste } from "@/lib/sonido";

type Screen = "hub" | "playing" | "end" | "country-selection";


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

export default function HangmanGameWrapper({ onBack }: { onBack: () => void }) {
  const [screen, setScreen] = useState<Screen>("hub");
  const [palabra, setPalabra] = useState<Palabra | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [mostrarAyuda, setMostrarAyuda] = useState(false);
  const [racha, setRacha] = useState(0);
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    const savedCountry = localStorage.getItem("hangman-user-country");
    if (savedCountry) setCountry(savedCountry);
  }, []);

  const dificultad = dificultadDeRacha(racha);

  const jugar = useCallback(() => {
    setPalabra(elegirPalabra(dificultad.longMin));
    setResultado(null);
    setScreen("playing");
  }, [dificultad.longMin]);

  const onFinish = useCallback((r: Resultado) => {
    if (!r.ganaste) reproducirMelodiaTriste();
    setRacha((prev) => (r.ganaste ? prev + 1 : 0));
    setResultado(r);

    if (r.ganaste) {
      updateScore();
      const currentCoins = parseInt(localStorage.getItem("user-coins") || "0");
      localStorage.setItem("user-coins", (currentCoins + 100).toString());
      setScreen("end");
    } else {
      setScreen("end");
    }
  }, []);

  const updateScore = () => {
    const profile = JSON.parse(localStorage.getItem("user-profile") || "{}");
    if (!profile.name) return;

    const saved = localStorage.getItem("hangman-scores");
    const scores = saved ? JSON.parse(saved) : [];
    const index = scores.findIndex((s: any) => s.name === profile.name);

    if (index > -1) {
      scores[index].points += 1;
    } else {
      scores.push({ 
        name: profile.name, 
        country: profile.country, 
        points: 1 
      });
    }
    localStorage.setItem("hangman-scores", JSON.stringify(scores));
  };

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
        <button
          onClick={onBack}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800"
        >
          Rendirse y volver al hub
        </button>
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
        <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-8 py-5">
          <span className="text-xs uppercase tracking-widest text-amber-400">
            {resultado.categoria}
          </span>
          <span className="text-4xl font-bold tracking-widest text-white">
            {resultado.palabra.toUpperCase()}
          </span>
          <span className="max-w-md text-sm italic text-zinc-400">{resultado.pista}</span>
        </div>
        <div className="flex flex-col items-center gap-6">
          <div className="text-sm text-zinc-400">
            Racha de victorias: <span className="font-bold text-green-400">{racha}</span>
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
          <button
            onClick={onBack}
            className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-zinc-300 hover:bg-zinc-800"
          >
            Volver al hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="flex flex-col items-center gap-6">
        <div>
          <h1 className="text-7xl font-black tracking-tight text-white">
            EL <span className="text-amber-500">AHORCADO</span>
          </h1>
          <p className="mt-3 text-zinc-400">
            Adivina la palabra antes de que el muñeco caiga en la lava.
          </p>
        </div>
        <HangmanLeaderboard />
      </div>
 
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={jugar}
          className="rounded-2xl bg-amber-500 px-12 py-4 text-2xl font-black text-zinc-900 shadow-lg shadow-amber-500/30 transition-transform hover:scale-105"
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
            <li>Se te muestra una <b>categoría</b> y una <b>pista</b>.</li>
            <li>Adivina la palabra letra por letra (teclado o botones).</li>
            <li>Cada letra equivocada dibuja una parte del muñeco.</li>
            <li>Si agotas los errores, el muñeco <b>cae en la lava</b>. ¡No lo dejes!</li>
            <li>Las tildes no cuentan (á = a) y la ñ sí se usa.</li>
            <li>
              <b>¡Ojo!</b> Cada victoria seguida sube la dificultad: menos errores y palabras
              más largas. La racha se reinicia si pierdes.
            </li>
          </ul>
        </div>
      )}
 
      <div className="flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-300">
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
  );
}
