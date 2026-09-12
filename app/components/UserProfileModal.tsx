"use client";

import { useEffect, useState } from "react";

export default function UserProfileModal({ onSave }: { onSave: (profile: { name: string; country: string }) => void }) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && country.trim()) {
      onSave({ name: name.trim(), country: country.trim() });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <h2 className="mb-6 text-center text-3xl font-black tracking-tight text-white">
          BIENVENIDO AL <span className="text-amber-500">SITIO</span>
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-zinc-400">Tu Nombre</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg bg-zinc-800 p-3 text-white outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Ej: Juan"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-zinc-400">Tu País</label>
            <input
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-lg bg-zinc-800 p-3 text-white outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Ej: Argentina"
            />
          </div>
          <button
            type="submit"
            className="mt-4 rounded-xl bg-amber-500 py-3 font-bold text-zinc-900 transition-transform hover:scale-105"
          >
            INGRESAR
          </button>
        </form>
      </div>
    </div>
  );
}
