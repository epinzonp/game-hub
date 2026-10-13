"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { ConvexError } from "convex/values";

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
  initialName = "",
  initialCountry = "Colombia",
  hasLegacy = false,
}: {
  onSave: (profile: {
    name: string;
    country: string;
    pin: string;
    mode: "register" | "login";
    transferLegacy: boolean;
  }) => Promise<void>;
  initialName?: string;
  initialCountry?: string;
  hasLegacy?: boolean;
}) {
  const [name, setName] = useState(initialName);
  const [pin, setPin] = useState("");
  const [mode, setMode] = useState<"register" | "login">("register");
  const [country, setCountry] = useState(
    countries.includes(initialCountry) ? initialCountry : "Colombia",
  );
  const [nameError, setNameError] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [transferLegacy, setTransferLegacy] = useState(hasLegacy);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError(true);
      return;
    }
    if (pending) return;
    setPending(true);
    setError("");
    try {
      await onSave({ name: trimmedName, country, pin, mode, transferLegacy });
    } catch (error) {
      setError(
        error instanceof ConvexError && typeof error.data === "string"
          ? error.data
          : "No pudimos guardar tu perfil. Inténtalo de nuevo.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10090d]/85 px-4 py-6 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        className="max-h-[calc(100dvh-3rem)] w-full max-w-md overflow-y-auto rounded-[24px] border border-white/10 bg-[#241519] p-6 shadow-2xl sm:p-8"
      >
        <h2
          id="welcome-title"
          className="mb-2 text-center text-3xl font-black tracking-tight text-white"
        >
          ¡Bienvenido a <span className="text-[#fff34b]">Game Hub!</span>
        </h2>
        <p className="mb-6 text-center text-sm leading-6 text-rose-100/65">
          {mode === "register"
            ? "Elige un nombre y un PIN. Guardaremos tus monedas y tu avatar."
            : "Usa tu nombre y PIN para recuperar tu progreso."}
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
              autoComplete="username"
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
              htmlFor="player-pin"
              className="text-sm font-bold text-rose-100/80"
            >
              PIN de 4 números
            </label>
            <input
              id="player-pin"
              type="password"
              inputMode="numeric"
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
              pattern="[0-9]{4}"
              minLength={4}
              maxLength={4}
              required
              value={pin}
              onChange={(event) => setPin(event.currentTarget.value)}
              placeholder="Tu PIN secreto"
              aria-describedby="pin-help"
              className="min-h-12 rounded-xl border border-white/10 bg-[#180e13] px-4 py-3 text-white outline-none placeholder:text-white/35 focus-visible:border-[#fff34b] focus-visible:ring-2 focus-visible:ring-[#fff34b]/30"
            />
            <p id="pin-help" className="text-xs text-rose-100/65">
              {mode === "register"
                ? "Recuerda tu nombre y PIN para entrar desde otro dispositivo."
                : "Este navegador recordará tu sesión."}
            </p>
          </div>
          {mode === "register" && (
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
          )}
          {mode === "register" && hasLegacy && (
            <label className="flex items-start gap-3 rounded-xl bg-[#180e13] p-4 text-sm text-rose-100">
              <input
                type="checkbox"
                checked={transferLegacy}
                onChange={(event) =>
                  setTransferLegacy(event.currentTarget.checked)
                }
                className="mt-1 size-5 accent-[#fff34b]"
              />
              Transferir a mi cuenta las monedas, el avatar y el récord de este
              navegador.
            </label>
          )}
          {error && (
            <p role="alert" className="text-sm text-rose-200">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="mt-2 min-h-12 rounded-xl bg-[#fff34b] py-3 font-black text-[#180e13] transition hover:bg-[#fff877] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {pending
              ? "Entrando…"
              : mode === "register"
                ? "Crear cuenta y jugar"
                : "Entrar al hub"}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              setMode(mode === "register" ? "login" : "register");
              setPin("");
              setError("");
            }}
            className="min-h-11 rounded-xl text-sm font-bold text-[#fff34b] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {mode === "register" ? "Ya tengo cuenta" : "Crear una cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}
