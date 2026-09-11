"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import HangmanDrawing from "./HangmanDrawing";
import ScareOverlay from "./ScareOverlay";
import { reproducirSusto } from "@/lib/sonido";
import type { Palabra } from "@/lib/palabras";

export interface Resultado {
  ganaste: boolean;
  palabra: string;
  categoria: string;
  pista: string;
}

const ALFABETO = "abcdefghijklmnñopqrstuvwxyz".split("");

function normalizar(c: string): string {
  return c
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

interface HangmanGameProps {
  palabra: Palabra;
  onFinish: (r: Resultado) => void;
  maxErrores?: number;
  dificultad?: string;
  racha?: number;
}

function dificultadColor(d: string): string {
  switch (d) {
    case "Normal":
      return "font-bold text-yellow-400";
    case "Difícil":
      return "font-bold text-orange-400";
    case "Extremo":
      return "font-bold text-red-500";
    default:
      return "font-bold text-green-400";
  }
}

export default function HangmanGame({
  palabra,
  onFinish,
  maxErrores = 6,
  dificultad = "Fácil",
  racha = 0,
}: HangmanGameProps) {
  const wordNorm = useMemo(() => palabra.palabra.trim().toLowerCase(), [palabra]);
  const [usadas, setUsadas] = useState<Set<string>>(new Set());
  const [errores, setErrores] = useState(0);
  const [perdio, setPerdio] = useState(false);
  const [susto, setSusto] = useState(false);
  const [terminado, setTerminado] = useState(false);
  const finishCalled = useRef(false);

  const aciertos = useMemo(() => {
    const s = new Set<string>();
    wordNorm.split("").forEach((c) => {
      if (usadas.has(c)) s.add(c);
    });
    return s;
  }, [usadas, wordNorm]);

  const ganaste = useMemo(() => {
    return wordNorm.split("").every((c) => aciertos.has(c));
  }, [wordNorm, aciertos]);

  const handleLetter = useCallback(
    (letra: string) => {
      const l = normalizar(letra);
      if (terminado || !ALFABETO.includes(l)) return;
      if (usadas.has(l)) return;

      setUsadas((prev) => new Set(prev).add(l));
      if (!wordNorm.includes(l)) {
        const nuevo = errores + 1;
        setErrores(nuevo);
        if (nuevo >= maxErrores) {
          setTerminado(true);
          setPerdio(true);
          setSusto(true);
          reproducirSusto();
        }
      }
    },
    [usadas, errores, wordNorm, terminado, maxErrores]
  );

  useEffect(() => {
    if (!susto) return;
    const t = setTimeout(() => setSusto(false), 1150);
    return () => clearTimeout(t);
  }, [susto]);

  useEffect(() => {
    if (perdio && !finishCalled.current) {
      finishCalled.current = true;
      const t = setTimeout(() => {
        onFinish({
          ganaste: false,
          palabra: palabra.palabra,
          categoria: palabra.categoria,
          pista: palabra.pista,
        });
      }, 1700);
      return () => clearTimeout(t);
    }
    if (ganaste && !finishCalled.current) {
      finishCalled.current = true;
      setTerminado(true);
      const t = setTimeout(() => {
        onFinish({
          ganaste: true,
          palabra: palabra.palabra,
          categoria: palabra.categoria,
          pista: palabra.pista,
        });
      }, 700);
      return () => clearTimeout(t);
    }
  }, [perdio, ganaste, onFinish, palabra]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (/^[a-zñáéíóúü]$/i.test(e.key)) {
        handleLetter(e.key);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleLetter]);

  const mostrarLetra = (idx: number) => {
    const c = wordNorm[idx];
    return aciertos.has(c) ? palabra.palabra[idx] : "_";
  };

  const vidas = maxErrores - errores;

  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-2xl">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="text-sm font-semibold uppercase tracking-widest text-amber-400">
          {palabra.categoria}
        </div>
        {(racha > 0 || dificultad !== "Fácil") && (
          <div className="text-sm text-zinc-300">
            Racha: <span className="font-bold text-green-400">{racha}</span> · Dificultad:{" "}
            <span
              className={dificultadColor(dificultad)}
            >
              {dificultad}
            </span>
          </div>
        )}
        <div className="text-sm text-zinc-300">
          Errores restantes: <span className="font-bold text-red-400">{vidas}</span>
        </div>
      </div>

      <p className="text-center text-zinc-400 italic">Pista: {palabra.pista}</p>

      <div className="grid w-full grid-cols-1 items-center gap-6 sm:grid-cols-2">
        <HangmanDrawing errores={errores} perdio={perdio} />

        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-2">
            {wordNorm.split("").map((_, idx) => (
              <div
                key={idx}
                className="flex h-12 w-8 items-center justify-center rounded-md border-b-4 border-amber-400 bg-zinc-800 text-2xl font-bold text-white sm:h-14 sm:w-10"
              >
                {mostrarLetra(idx)}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-1.5">
            {ALFABETO.map((l) => {
              const usado = usadas.has(l);
              const acertada = aciertos.has(l);
              return (
                <button
                  key={l}
                  disabled={usado || terminado}
                  onClick={() => handleLetter(l)}
                  className={`h-10 w-8 rounded-md text-sm font-bold uppercase transition-colors ${
                    usado
                      ? acertada
                        ? "cursor-default bg-green-800 text-green-200"
                        : "cursor-default bg-red-900 text-red-300"
                      : "bg-zinc-700 text-white hover:bg-amber-500 hover:text-zinc-900"
                  }`}
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {perdio && (
        <div className="animate-pulse text-2xl font-bold text-red-500">
          ¡Se cayó en la lava!
        </div>
      )}
      {ganaste && !perdio && (
        <div className="text-2xl font-bold text-green-400">¡Victoria!</div>
      )}

      <ScareOverlay activo={susto} />
    </div>
  );
}
