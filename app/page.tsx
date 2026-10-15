"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { useState, useSyncExternalStore } from "react";
import GameHub from "@/app/components/GameHub";
import UserProfileModal from "@/app/components/UserProfileModal";
import { api } from "@/convex/_generated/api";
import type { GameRouteId } from "@/lib/game-routes";
import {
  clearTransferredProgress,
  getLegacySnapshot,
  parseLegacySnapshot,
  subscribeToLegacyProgress,
} from "@/lib/legacy-progress";
import {
  getPlayerSession,
  savePlayerSession,
  subscribeToPlayerSession,
} from "@/lib/player-session";

export function GameHubShell({
  startInStore = false,
  startInProfile = false,
  initialGame,
}: {
  startInStore?: boolean;
  startInProfile?: boolean;
  initialGame?: GameRouteId;
}) {
  const hasHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const sessionToken = useSyncExternalStore(
    subscribeToPlayerSession,
    getPlayerSession,
    () => null,
  );
  const profile = useQuery(
    api.players.me,
    sessionToken ? { sessionToken } : "skip",
  );
  const register = useAction(api.accounts.register);
  const login = useAction(api.accounts.login);
  const purchaseAvatar = useMutation(api.players.purchaseAvatar);
  const awardWin = useMutation(api.players.awardWin);
  const awardTiragolGoal = useMutation(api.players.awardTiragolGoal);
  const signOut = useMutation(api.players.signOut);
  const legacySnapshot = useSyncExternalStore(
    subscribeToLegacyProgress,
    getLegacySnapshot,
    () => null,
  );
  const legacy = parseLegacySnapshot(legacySnapshot);
  const [error, setError] = useState("");

  if (!hasHydrated || (sessionToken && profile === undefined))
    return (
      <p role="status" className="w-full p-10 text-center text-white">
        Cargando tu progreso…
      </p>
    );
  if (!profile || !sessionToken)
    return (
      <main className="min-h-screen w-full">
        <UserProfileModal
          initialName={legacy?.name || ""}
          initialCountry={legacy?.country || "Colombia"}
          hasLegacy={legacy !== null}
          onSave={async ({ name, country, pin, mode, transferLegacy }) => {
            const token =
              mode === "login"
                ? await login({ name, pin })
                : await register({
                    name,
                    country,
                    pin,
                    ...(transferLegacy && legacy
                      ? {
                          legacy: {
                            guestId: legacy.guestId,
                            coins: legacy.coins,
                            maxCoins: legacy.maxCoins,
                            avatar: legacy.avatar,
                          },
                        }
                      : {}),
                  });
            savePlayerSession(token);
            setError("");
            if (mode === "register" && transferLegacy && legacy)
              clearTransferredProgress();
          }}
        />
      </main>
    );
  return (
    <div className="w-full">
      {error && (
        <p role="alert" className="bg-[#391923] p-4 text-center text-white">
          {error}
        </p>
      )}
      <GameHub
        key={`${profile._id}:${initialGame ?? (startInProfile ? "profile" : startInStore ? "store" : "home")}`}
        name={profile.name}
        country={profile.country}
        initialAvatar={profile.avatar}
        initialCoins={profile.coins}
        maxCoins={profile.maxCoins}
        ownedAvatars={profile.ownedAvatars}
        initialGame={initialGame}
        startInStore={startInStore}
        startInProfile={startInProfile}
        onPurchase={async (avatar) => {
          await purchaseAvatar({ sessionToken, avatar });
        }}
        onWin={async () => {
          await awardWin({ sessionToken });
        }}
        onTiragolGoal={async () => {
          await awardTiragolGoal({ sessionToken });
        }}
        onSignOut={() => {
          void signOut({ sessionToken })
            .then(() => savePlayerSession(null))
            .catch(() =>
              setError("No pudimos cerrar la sesión. Inténtalo de nuevo."),
            );
        }}
      />
    </div>
  );
}

export default function Home() {
  return <GameHubShell />;
}
