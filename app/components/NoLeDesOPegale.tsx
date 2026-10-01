"use client";

import React, { useState, useEffect } from "react";
import { reproducirTicTac } from "@/lib/sonido";

export default function NoLeDesOPegale({ onBack }: { onBack: () => void }) {
  const [score, setScore] = useState(0);
  const [activeHole, setActiveHole] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState<"start" | "playing" | "ended">("start");
  const [difficulty, setDifficulty] = useState<"facil" | "medio" | "dificil" | "imposible">("facil");

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

  const handleHit = (index: number) => {
    if (index === activeHole) {
      setScore(prev => prev + 1);
      setActiveHole(null);
      reproducirTicTac();
    }
  };

  if (gameState === "start") {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-zinc-900 text-white">
        <h1 className="text-6xl font-black italic text-red-500">NO LE DES O PEGALE</h1>
        <p className="text-xl text-zinc-400">¡Pégale a los muñecos que salgan de los huecos!</p>
        
        <div className="flex flex-col items-center gap-4">
          <p className="font-bold text-zinc-300">Selecciona Dificultad:</p>
          <div className="flex gap-2">
            {(["facil", "medio", "dificil", "imposible"] as const).map((lvl) => (
              <button 
                key={lvl}
                onClick={() => setDifficulty(lvl)}
                className={`px-4 py-2 rounded-lg font-bold capitalize transition-all ${
                  difficulty === lvl 
                    ? "bg-red-600 text-white scale-110 shadow-lg" 
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button 
            onClick={() => setGameState("playing")} 
            className="rounded-xl bg-red-600 px-8 py-3 font-bold hover:bg-red-500 transition-all"
          >
            Empezar Juego
          </button>
          <button 
            onClick={onBack} 
            className="rounded-xl bg-zinc-700 px-8 py-3 font-bold hover:bg-zinc-600 transition-all"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (gameState === "ended") {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-zinc-900 text-white">
        <h1 className="text-6xl font-black italic">FIN DEL JUEGO</h1>
        <p className="text-3xl font-bold text-amber-400">Puntuación: {score}</p>
        <div className="flex gap-4">
          <button 
            onClick={() => {
              setScore(0);
              setTimeLeft(30);
              setGameState("playing");
            }} 
            className="rounded-xl bg-red-600 px-8 py-3 font-bold hover:bg-red-500 transition-all"
          >
            Reintentar
          </button>
          <button 
            onClick={onBack} 
            className="rounded-xl bg-zinc-700 px-8 py-3 font-bold hover:bg-zinc-600 transition-all"
          >
            Volver al Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-8 bg-zinc-900 text-white">
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

      <button 
        onClick={onBack} 
        className="mt-8 rounded-xl bg-zinc-700 px-6 py-2 font-bold hover:bg-zinc-600 transition-all"
      >
        Salir
      </button>
    </div>
  );
}
