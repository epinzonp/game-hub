"use client";

import React, { useState } from "react";
import HangmanGameWrapper from "./HangmanGameWrapper";
import Tiragol from "./Tiragol";
import AirHockey from "./AirHockey";
import Botecolor from "./Botecolor";
import Radiotricky from "./Radiotricky";
import PinPon from "./PinPon";

type GameId = "hangman" | "tiragol" | "airhockey" | "botecolor" | "pinpon" | "radiotricky" | null;

export default function GameHub() {
  const [currentGame, setCurrentGame] = useState<GameId>(null);

  if (currentGame === "hangman") {
    return <HangmanGameWrapper onBack={() => setCurrentGame(null)} />;
  }
  
  if (currentGame === "tiragol") {
    return <Tiragol onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === "airhockey") {
    return <AirHockey onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === "botecolor") {
    return <Botecolor onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === "pinpon") {
    return <PinPon onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === "radiotricky") {
    return <Radiotricky onBack={() => setCurrentGame(null)} />;
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-12 p-6 text-center">
      <div>
        <h1 className="text-7xl font-black tracking-tight text-white">
          GAME <span className="text-amber-500">HUB</span>
        </h1>
        <p className="mt-3 text-zinc-400">Selecciona un juego para comenzar</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <button
          onClick={() => setCurrentGame("hangman")}
          className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-amber-500 hover:bg-zinc-800"
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white">El Ahorcado</h3>
            <p className="mt-2 text-sm text-zinc-400">Adivina la palabra antes de que el muñeco caiga en la lava.</p>
          </div>
          <div className="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
            😵
          </div>
        </button>

        <button
          onClick={() => setCurrentGame("tiragol")}
          className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-amber-500 hover:bg-zinc-800"
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white">Tiragol</h3>
            <p className="mt-2 text-sm text-zinc-400">¡Lanza el balón y marca el mejor récord de goles!</p>
          </div>
          <div className="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
            ⚽
          </div>
        </button>

        <button
          onClick={() => setCurrentGame("airhockey")}
          className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-amber-500 hover:bg-zinc-800"
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white">Hockey de Aire</h3>
            <p className="mt-2 text-sm text-zinc-400">Desliza el disco y vence a la IA o a un amigo.</p>
          </div>
          <div className="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
            🏒
          </div>
        </button>

        <button
          onClick={() => setCurrentGame("botecolor")}
          className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-amber-500 hover:bg-zinc-800"
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white">Botecolor</h3>
            <p className="mt-2 text-sm text-zinc-400">Organiza los colores en las botellas.</p>
          </div>
          <div className="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
            🎨
          </div>
        </button>

        <button
          onClick={() => setCurrentGame("pinpon")}
          className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-amber-500 hover:bg-zinc-800"
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white">Pin Pon</h3>
            <p className="mt-2 text-sm text-zinc-400">¡Rápido y divertido! Rebota la pelota y gana.</p>
          </div>
          <div className="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
            🏓
          </div>
        </button>

        <button
          onClick={() => setCurrentGame("radiotricky")}
          className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-amber-500 hover:bg-zinc-800"
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white">Radiotricky</h3>
            <p className="mt-2 text-sm text-zinc-400">Tres en Raya con onda. VS Amigo o IA.</p>
          </div>
          <div className="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
            📻
          </div>
        </button>

        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 flex items-center justify-center text-zinc-600 italic">
          Próximo juego...
        </div>
      </div>
    </div>
  );
}
