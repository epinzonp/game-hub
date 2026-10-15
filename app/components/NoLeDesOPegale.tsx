"use client";

import React, { useState, useEffect, useRef } from "react";
import { reproducirTicTac } from "@/lib/sonido";
import GameEntryScreen from "./GameEntryScreen";
import { useGameProgress } from "./GameNavigationGuard";

export default function NoLeDesOPegale({
  onWin,
}: {
  onWin: () => Promise<void>;
}) {
  const [score, setScore] = useState(0);
  const [activeHole, setActiveHole] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState<"start" | "playing" | "ended">("start");
  const [difficulty, setDifficulty] = useState<"facil" | "medio" | "dificil" | "imposible">("facil");
  const [rewardError, setRewardError] = useState("");
  const rewardGranted = useRef(false);

  useGameProgress(gameState !== "start");

  const difficultyConfig = {
    facil: { speed: 1000, visible: 800 },
    medio: { speed: 700, visible: 600 },
    dificil: { speed: 500, visible: 400 },
    imposible: { speed: 300, visible: 250 },
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let gameInterval: NodeJS.Timeout;

    if (gameState === "playing") {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("ended");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      gameInterval = setInterval(() => {
        const randomHole = Math.floor(Math.random() * 9);
        setActiveHole(randomHole);
        
        setTimeout(() => setActiveHole(null), difficultyConfig[difficulty].visible);
      }, difficultyConfig[difficulty].speed);
    }

    return () => {
      clearInterval(timer);
      clearInterval(gameInterval);
    };
  }, [gameState, difficulty]);

  useEffect(() => {
    if (gameState === "playing") {
      rewardGranted.current = false;
      return;
    }
    if (gameState !== "ended" || rewardGranted.current) return;

    rewardGranted.current = true;
    if (score < 6) return;

    void onWin().catch(() =>
      setRewardError(
        "No pudimos guardar las monedas de esta ronda. Revisa tu conexión.",
      ),
    );
  }, [gameState, onWin, score]);

  const handleHit = (index: number) => {
    if (index === activeHole) {
      setScore(prev => prev + 1);
      setActiveHole(null);
      reproducirTicTac();
    }
  };

  if (gameState === "start") {
    return (
      <GameEntryScreen
        title="No Le Des o Pégale"
        description="¡Pégale a los muñecos que salgan de los huecos!"
        image="/game-covers/cover-2.webp"
      >
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-extrabold">Selecciona dificultad</h2>
          <div className="grid w-full grid-cols-2 gap-2">
            {(
              [
                ["facil", "Fácil"],
                ["medio", "Medio"],
                ["dificil", "Difícil"],
                ["imposible", "Imposible"],
              ] as const
            ).map(([lvl, label]) => (
              <button 
                key={lvl}
                onClick={() => setDifficulty(lvl)}
                className={`px-4 py-2 rounded-lg font-bold capitalize transition-all ${
                  difficulty === lvl 
                    ? "bg-[#fff34b] text-[#180e13] shadow-lg"
                    : "bg-[#392126] text-rose-100/75 hover:bg-[#4a2932]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <button 
            onClick={() => setGameState("playing")} 
            className="min-h-12 rounded-xl bg-[#fff34b] px-8 py-3 font-black text-[#180e13] transition hover:bg-[#fff877] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Empezar Juego
          </button>
        </div>
      </GameEntryScreen>
    );
  }

  if (gameState === "ended") {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-[#180e13] text-white">
        {score >= 6 && (
          <div
            role="status"
            aria-label="Ganaste 100 monedas"
            className="pointer-events-none text-6xl font-black text-green-400 drop-shadow-[0_5px_0_#14532d] coin-reward-pop"
          >
            100+
          </div>
        )}
        <h1 className="text-6xl font-black italic">FIN DEL JUEGO</h1>
        <p className="text-3xl font-bold text-amber-400">Puntuación: {score}</p>
        {rewardError && (
          <p role="alert" className="text-sm text-rose-200">
            {rewardError}
          </p>
        )}
        <div className="flex gap-4">
          <button 
            onClick={() => {
              setScore(0);
              setTimeLeft(30);
              setRewardError("");
              setGameState("playing");
            }} 
            className="rounded-xl bg-red-600 px-8 py-3 font-bold hover:bg-red-500 transition-all"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-8 bg-[#180e13] text-white">
      <div className="flex justify-between w-full max-w-md px-4 mb-4">
        <div className="text-2xl font-bold">Tiempo: <span className="text-red-500">{timeLeft}s</span></div>
        <div className="text-2xl font-bold">Score: <span className="text-amber-400">{score}</span></div>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 bg-zinc-800 rounded-3xl border-4 border-zinc-700 shadow-2xl">
        {[...Array(9)].map((_, i) => (
          <div 
            key={i} 
            onClick={() => handleHit(i)}
            className="w-24 h-24 sm:w-32 sm:h-32 bg-zinc-950 rounded-full border-b-8 border-zinc-900 relative overflow-hidden cursor-pointer group"
          >
            <div 
              className={`absolute left-1/2 -translate-x-1/2 w-16 h-16 sm:w-20 sm:h-20 transition-all duration-100 ease-out flex items-center justify-center text-4xl
                ${activeHole === i ? "bottom-4 opacity-100" : "bottom-[-100px] opacity-0"}
              `}
            >
              {["🤡", "👹", "👽", "🤖", "👻", "👺", "👾", "🎃", "💀"][i]}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
