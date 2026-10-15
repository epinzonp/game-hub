"use client";

import React, { useState, useEffect, useRef } from "react";
import { reproducirVertidoAgua } from "@/lib/sonido";
import GameEntryScreen from "./GameEntryScreen";
import { useGameProgress } from "./GameNavigationGuard";

type Color = string;
type Bottle = Color[];

const COLORS = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"]; // Rojo, Verde, Azul, Amarillo
const MAX_CAPACITY = 4;

export default function Botecolor({ onWin }: { onWin: () => Promise<void> }) {
  const [level, setLevel] = useState(1);
  const [started, setStarted] = useState(false);
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [selectedBottle, setSelectedBottle] = useState<number | null>(null);
  const [win, setWin] = useState(false);
  const [rewardError, setRewardError] = useState("");
  const rewardGranted = useRef(false);

  useGameProgress(started);

  // Inicializar juego
  useEffect(() => {
    initGame();
  }, [level]);

  useEffect(() => {
    if (!win) {
      rewardGranted.current = false;
      return;
    }
    if (rewardGranted.current) return;
    rewardGranted.current = true;
    void onWin().catch(() =>
      setRewardError("No pudimos guardar las monedas de este nivel. Revisa tu conexión."),
    );
  }, [onWin, win]);

  const initGame = () => {
    const numColors = level + 2; // Nivel 1: 3 colores, Nivel 2: 4, Nivel 3: 5
    const allColors: Color[] = [];
    
    // Definir paleta de colores extendida
    const palette = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];
    const activeColors = palette.slice(0, numColors);

    activeColors.forEach(c => {
      for (let i = 0; i < MAX_CAPACITY; i++) allColors.push(c);
    });
    
    // Mezclar colores aleatoriamente
    for (let i = allColors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allColors[i], allColors[j]] = [allColors[j], allColors[i]];
    }

    const gameBottles: Bottle[] = [];
    for (let i = 0; i < numColors; i++) {
      gameBottles.push(allColors.slice(i * MAX_CAPACITY, (i + 1) * MAX_CAPACITY));
    }

    // Botellas de ayuda: siempre 2 adicionales
    for (let i = 0; i < 2; i++) {
      gameBottles.push([]);
    }

    setBottles(gameBottles);
    setWin(false);
    setSelectedBottle(null);
  };

  const handleBottleClick = (index: number) => {
    if (win) return;

    if (selectedBottle === null) {
      // Seleccionar botella si no está vacía
      if (bottles[index].length > 0) {
        setSelectedBottle(index);
      }
    } else {
      if (selectedBottle === index) {
        setSelectedBottle(null);
        return;
      }

      const fromBottle = bottles[selectedBottle];
      const toBottle = bottles[index];
      const colorToMove = fromBottle[fromBottle.length - 1];

      // Reglas de vertido:
      // 1. La botella destino no puede estar llena
      // 2. El color superior debe coincidir o la botella destino debe estar vacía
      if (toBottle.length < MAX_CAPACITY && (toBottle.length === 0 || toBottle[toBottle.length - 1] === colorToMove)) {
        
        reproducirVertidoAgua();

        // Mover todas las capas del mismo color seguidas
        const newFrom = [...fromBottle];
        const newTo = [...toBottle];
        
        let movedCount = 0;
        while (
          newFrom.length > 0 && 
          newFrom[newFrom.length - 1] === colorToMove && 
          newTo.length < MAX_CAPACITY
        ) {
          newTo.push(newFrom.pop()!);
          movedCount++;
        }

        const newBottles = [...bottles];
        newBottles[selectedBottle] = newFrom;
        newBottles[index] = newTo;
        
        setBottles(newBottles);
        setSelectedBottle(null);
        checkWin(newBottles);
      } else {
        setSelectedBottle(index); // Cambiar selección si el movimiento es inválido
      }
    }
  };

  const checkWin = (currentBottles: Bottle[]) => {
    const isSolved = currentBottles.every(b => {
      if (b.length === 0) return true;
      if (b.length !== MAX_CAPACITY) return false;
      return b.every(c => c === b[0]);
    });

    if (isSolved) {
      setWin(true);
    }
  };

  if (!started) {
    return (
      <GameEntryScreen
        title="Botecolor"
        description="Ordena los colores en las botellas y completa cada nivel."
        image="/game-covers/cover-4.webp"
      >
        <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#fff34b]">Nivel 1 · Fácil</p>
        <button
          onClick={() => setStarted(true)}
          className="min-h-12 rounded-xl bg-[#fff34b] px-8 py-3 text-lg font-black text-[#180e13] transition hover:bg-[#fff877] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Empezar a jugar
        </button>
      </GameEntryScreen>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-12 bg-[#180e13] p-4 text-white overflow-hidden relative">
      
      <div className="text-center z-10 drop-shadow-lg">
        <h1 className="text-6xl font-black italic text-white">BOTE<span className="text-[#fff34b]">COLOR</span></h1>
        <p className="mt-2 font-bold text-rose-100/75 drop-shadow-md">
          {level === 1 ? "Nivel 1: Fácil" : level === 2 ? "Nivel 2: Medio" : "Nivel 3: Difícil"}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-4xl z-10">
        {bottles.map((bottle, i) => (
          <div 
            key={i} 
            onClick={() => handleBottleClick(i)}
            className={`relative w-16 h-48 border-4 border-white rounded-b-2xl cursor-pointer transition-all duration-200 ${selectedBottle === i ? 'border-amber-500 scale-110' : 'border-white'}`}
            style={{ 
              display: 'flex', 
              flexDirection: 'column-reverse', 
              overflow: 'hidden',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }}
          >
            {bottle.map((color, idx) => (
              <div 
                key={idx} 
                className="w-full transition-all duration-300" 
                style={{ height: `${100 / MAX_CAPACITY}%`, backgroundColor: color }} 
              />
            ))}
          </div>
        ))}
      </div>

      {win && (
        <div className="flex flex-col items-center gap-4 animate-bounce">
          <div
            role="status"
            aria-label="Ganaste 100 monedas"
            className="pointer-events-none text-6xl font-black text-green-500 drop-shadow-[0_5px_0_#14532d] coin-reward-pop"
          >
            100+
          </div>
          <h2 className="text-4xl font-bold text-green-400">¡NIVEL COMPLETADO!</h2>
          {rewardError && <p role="alert" className="text-sm text-red-900">{rewardError}</p>}
          <div className="flex gap-4">
            {level < 3 ? (
              <button onClick={() => { setLevel(l => l + 1); setWin(false); }} className="bg-amber-500 text-zinc-900 px-6 py-2 rounded-full font-bold">Siguiente Nivel</button>
            ) : (
              <button onClick={initGame} className="bg-amber-500 text-zinc-900 px-6 py-2 rounded-full font-bold">Reiniciar Juego</button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
