"use client";

import React, { useState, useEffect } from "react";
import HangmanGameWrapper from "./HangmanGameWrapper";
import Tiragol from "./Tiragol";
import AirHockey from "./AirHockey";
import Botecolor from "./Botecolor";
import Radiotricky from "./Radiotricky";
import PinPon from "./PinPon";

type GameId = "hangman" | "tiragol" | "airhockey" | "botecolor" | "pinpon" | "radiotricky" | "friends" | "store" | null;

export default function GameHub() {
  const [currentGame, setCurrentGame] = useState<GameId>(null);
  const [daysLeft, setDaysLeft] = useState(10);

  const handleGameSelect = (game: GameId) => {
    if (game === "store" || game === "friends") {
      setCurrentGame(game);
      return;
    }
    if (!localStorage.getItem("user-cube")) {
      alert("Antes de empezar tienes que ir a la tienda y escoger el avatar");
      setCurrentGame("store");
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

    const calculateDays = () => {
      const now = new Date();
      const next = new Date(localStorage.getItem("next-game-date") || "");
      const diffTime = next.getTime() - now.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      setDaysLeft(diffDays > 0 ? diffDays : 0);
    };

    calculateDays();
  }, []);

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

  if (currentGame === "friends") {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-8 bg-zinc-900 text-white">
        <h1 className="text-6xl font-black italic">MODO <span className="text-blue-500">AMIGOS</span></h1>
        <p className="text-xl text-zinc-400">Pronto podrás jugar contra tus amigos en tiempo real.</p>
        <button onClick={() => setCurrentGame(null)} className="rounded-xl bg-blue-600 px-8 py-3 font-bold hover:bg-blue-500">Volver al Hub</button>
      </div>
    );
  }

  if (currentGame === "store") {
    const coins = parseInt(localStorage.getItem("user-coins") || "0");
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-8 bg-zinc-900 text-white">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-6xl font-black italic">TIENDA DE <span className="text-amber-500">CUBITOS</span></h1>
          <div className="text-2xl font-bold text-amber-400 bg-zinc-800 px-4 py-1 rounded-full border border-amber-600">
            💰 {coins} monedas
          </div>
        </div>
         <div className="grid grid-cols-3 gap-6">
           {[
             { emoji: "😊", name: "Feliz", price: 0 },
             { emoji: "😢", name: "Triste", price: 500 },
             { emoji: "😡", name: "Enojado", price: 1000 },
             { emoji: "😱", name: "Susto", price: 2000 },
             { emoji: "😎", name: "Cool", price: 5000 },
             { emoji: "😴", name: "Sueño", price: 10000 },
             { emoji: "67", name: "Misterioso 67", price: 25000 },
           ].map((cube) => (
             <div 
               key={cube.name} 
               className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-zinc-800 border-2 border-transparent hover:border-amber-500 cursor-pointer transition-all hover:scale-105"
               onClick={() => {
                 if (coins >= cube.price) {
                   localStorage.setItem("user-cube", cube.emoji);
                   if (cube.price > 0) {
                     localStorage.setItem("user-coins", (coins - cube.price).toString());
                   }
                   alert(`Has elegido el cubito ${cube.name}`);
                 } else {
                   alert("No tienes suficientes monedas");
                 }
               }}
             >
               <div className={`text-6xl p-4 rounded-lg shadow-inner ${cube.emoji === "67" ? "bg-blue-600 text-white font-bold" : "bg-zinc-700"}`}>
                 {cube.emoji}
               </div>
               <span className="font-bold">{cube.name}</span>
               <span className="text-sm text-amber-400">{cube.price === 0 ? "Gratis" : `💰 ${cube.price}`}</span>
             </div>
           ))}
         </div>
         <button 
           onClick={() => setCurrentGame(null)} 
           className="flex items-center gap-2 rounded-xl bg-amber-600 px-8 py-3 font-bold hover:bg-amber-500 transition-all"
         >
           <span className="text-xl -translate-y-0.5">←</span> Volver al Hub
         </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-12 p-6 text-center bg-gradient-to-br from-yellow-500 via-blue-500 to-red-500">
      <div>
        <h1 className="text-7xl font-black tracking-tight text-white">
          GAME <span className="text-amber-500">HUB</span>
        </h1>
        <p className="mt-3 text-zinc-400">Selecciona un juego para comenzar</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
         <button
           onClick={() => handleGameSelect("hangman")}
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
           onClick={() => handleGameSelect("tiragol")}
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
           onClick={() => handleGameSelect("airhockey")}
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
           onClick={() => handleGameSelect("botecolor")}
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
           onClick={() => handleGameSelect("pinpon")}
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
            onClick={() => handleGameSelect("radiotricky")}
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

          <button
            onClick={() => setCurrentGame("friends")}
            className="group relative overflow-hidden rounded-2xl border border-blue-800 bg-zinc-900 p-8 transition-all hover:border-blue-500 hover:bg-zinc-800"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white">Amigos</h3>
              <p className="mt-2 text-sm text-zinc-400">¡Reta a tus amigos y demuestra quién es el mejor!</p>
            </div>
            <div className="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
              👥
            </div>
          </button>

          <button
            onClick={() => setCurrentGame("store")}
            className="group relative overflow-hidden rounded-2xl border border-amber-800 bg-zinc-900 p-8 transition-all hover:border-amber-500 hover:bg-zinc-800"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white">Tienda</h3>
              <p className="mt-2 text-sm text-zinc-400">Elige tu cubito y personaliza tu avatar.</p>
            </div>
            <div className="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
              🛒
            </div>
          </button>

        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 flex items-center justify-center text-zinc-600 italic">
           Próximo juego... en {daysLeft} días
        </div>
      </div>
    </div>
  );
}
