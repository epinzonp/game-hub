"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const countries = [
  "Argentina",
  "Bolivia",
  "Brasil",
  "Canadá",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Cuba",
  "Ecuador",
  "El Salvador",
  "España",
  "Estados Unidos",
  "Guatemala",
  "Honduras",
  "México",
  "Nicaragua",
  "Panamá",
  "Paraguay",
  "Perú",
  "Puerto Rico",
  "República Dominicana",
  "Uruguay",
  "Venezuela",
];

export default function UserProfileModal({
  onSave,
}: {
  onSave: (profile: { name: string; country: string }) => void;
}) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("Colombia");
  const [nameError, setNameError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError(true);
      return;
    }
    onSave({ name: trimmedName, country });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10090d]/85 px-4 py-6 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        className="w-full max-w-md rounded-[24px] border border-white/10 bg-[#241519] p-6 shadow-2xl sm:p-8"
      >
        <h2
          id="welcome-title"
          className="mb-2 text-center text-3xl font-black tracking-tight text-white"
        >
          ¡Bienvenido a <span className="text-[#fff34b]">Game Hub!</span>
        </h2>
        <p className="mb-6 text-center text-sm leading-6 text-rose-100/65">
          Cuéntanos cómo te llamas y de dónde eres.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="player-name"
              className="text-sm font-bold text-rose-100/80"
            >
              Tu nombre
            </label>
            <input
              id="player-name"
              autoComplete="nickname"
              maxLength={32}
              required
              value={name}
              onChange={(e) => {
                setName(e.currentTarget.value);
                setNameError(false);
              }}
              placeholder="Escribe tu nombre"
              className="min-h-12 rounded-xl border border-white/10 bg-[#180e13] px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus-visible:border-[#fff34b] focus-visible:ring-2 focus-visible:ring-[#fff34b]/30"
            />
            {nameError && (
              <p className="text-sm text-rose-300" role="alert">
                Escribe un nombre para continuar.
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="player-country"
              className="text-sm font-bold text-rose-100/80"
            >
              Tu país
            </label>
            <div className="relative">
              <select
                id="player-country"
                value={country}
                onChange={(e) => setCountry(e.currentTarget.value)}
                className="min-h-12 w-full appearance-none rounded-xl border border-white/10 bg-[#180e13] px-4 py-3 pr-12 text-white outline-none transition focus-visible:border-[#fff34b] focus-visible:ring-2 focus-visible:ring-[#fff34b]/30"
              >
                {countries.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-white/75"
                aria-hidden="true"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-2 min-h-12 rounded-xl bg-[#fff34b] py-3 font-black text-[#180e13] transition hover:bg-[#fff877] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Entrar al hub
          </button>
        </form>
      </div>
    </div>
  );
}
