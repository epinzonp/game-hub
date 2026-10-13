"use client";

import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { Coins } from "lucide-react";
import { ConvexError } from "convex/values";
import { useState } from "react";
import { avatars } from "../../lib/avatars";

export function AvatarSetupChoices({
  coins,
  pending,
  onChoose,
}: {
  coins: number;
  pending: boolean;
  onChoose: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {avatars
        .filter((avatar) => avatar.price <= coins)
        .map((avatar) => (
          <button
            key={avatar.id}
            type="button"
            disabled={pending}
            onClick={() => onChoose(avatar.id)}
            className="flex min-h-44 flex-col items-center gap-3 rounded-2xl border border-white/10 bg-[#180e13] p-4 font-bold transition hover:border-[#fff34b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fff34b] disabled:opacity-60"
          >
            <Image
              src={`/avatars/${avatar.image ?? `${avatar.id}.webp`}`}
              alt=""
              width={96}
              height={96}
              className="size-24 rounded-xl object-cover"
            />
            <span>{avatar.name}</span>
            <span className="text-sm text-[#fff34b]">
              {avatar.price === 0
                ? "Elegir gratis"
                : `${avatar.price.toLocaleString("es-CO")} monedas`}
            </span>
          </button>
        ))}
    </div>
  );
}

export default function AvatarSetupDialog({
  coins,
  onChoose,
  onSignOut,
}: {
  coins: number;
  onChoose: (id: string) => Promise<void>;
  onSignOut: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function choose(id: string) {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      await onChoose(id);
    } catch (error) {
      setError(
        error instanceof ConvexError && typeof error.data === "string"
          ? error.data
          : "No pudimos guardar tu avatar. Inténtalo de nuevo.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <Dialog.Root
      open
      disablePointerDismissal
      onOpenChange={(_, details) => details.cancel()}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-[#10090d]/85 backdrop-blur-sm" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%_-_2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-white/15 bg-[#241519] p-6 text-white shadow-2xl sm:p-8">
          <Dialog.Title className="text-3xl font-black">
            Elige tu avatar
          </Dialog.Title>
          <Dialog.Description className="mt-3 text-sm leading-6 text-rose-100/80">
            Antes de jugar, elige quién te acompañará en tus partidas. Estos
            avatares están disponibles con tus monedas. Podrás cambiarlo en la
            tienda después.
          </Dialog.Description>
          <p className="my-5 flex items-center gap-2 font-bold text-[#fff34b]">
            <Coins className="size-5" aria-hidden="true" />
            Tienes {coins.toLocaleString("es-CO")} monedas
          </p>
          <AvatarSetupChoices
            coins={coins}
            pending={pending}
            onChoose={(id) => void choose(id)}
          />
          {pending && (
            <p role="status" className="mt-4 text-sm">
              Guardando tu avatar…
            </p>
          )}
          {error && (
            <p role="alert" className="mt-4 text-sm text-rose-200">
              {error}
            </p>
          )}
          <Dialog.Close
            onClick={onSignOut}
            disabled={pending}
            className="mt-5 min-h-11 rounded-xl px-3 text-sm font-bold text-rose-100/70 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#fff34b]"
          >
            Cambiar cuenta
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
