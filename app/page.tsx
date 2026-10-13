"use client";
import GameHub from "@/app/components/GameHub";
import UserProfileModal from "@/app/components/UserProfileModal";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

const profileKey = "user-profile";
const profileChangeEvent = "user-profile-change";
const hydrationPending = "\u0000";

function getSavedProfile(): string | null {
  const saved = localStorage.getItem(profileKey);
  if (!saved) return null;

  try {
    const parsed: unknown = JSON.parse(saved);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "country" in parsed &&
      typeof parsed.country === "string" &&
      parsed.country.trim() &&
      "name" in parsed &&
      typeof parsed.name === "string" &&
      parsed.name.trim()
    ) {
      return [
        parsed.name.trim(),
        parsed.country.trim(),
        localStorage.getItem("user-cube") || "",
        localStorage.getItem("user-coins") || "0",
      ]
        .map(encodeURIComponent)
        .join("|");
    }
  } catch {
    // Invalid saved registration data leaves the gate in place.
  }

  return null;
}

function subscribeToProfile(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(profileChangeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(profileChangeEvent, onChange);
  };
}

export function GameHubShell({ startInStore = false }: { startInStore?: boolean }) {
  const router = useRouter();
  const savedProfile = useSyncExternalStore(
    subscribeToProfile,
    getSavedProfile,
    () => hydrationPending,
  );
  const isReady = savedProfile !== hydrationPending;
  const [
    encodedName = "",
    encodedCountry = "",
    encodedCube = "",
    encodedCoins = "0",
  ] = savedProfile?.split("|") ?? [];
  const name = decodeURIComponent(encodedName);
  const country = decodeURIComponent(encodedCountry);
  const avatar = decodeURIComponent(encodedCube) || null;
  const coins = Number.parseInt(decodeURIComponent(encodedCoins), 10) || 0;
  const profile = savedProfile ? { name, country } : null;

  const handleSaveProfile = (data: { name: string; country: string }) => {
    localStorage.setItem(
      profileKey,
      JSON.stringify({ name: data.name.trim(), country: data.country }),
    );
    window.dispatchEvent(new Event(profileChangeEvent));
    if (!startInStore) router.push("/store");
  };

  const handleSignOut = () => {
    localStorage.removeItem(profileKey);
    window.dispatchEvent(new Event(profileChangeEvent));
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-zinc-950 text-zinc-50">
      {isReady && (profile ? (
        <GameHub
          name={profile.name}
          country={profile.country}
          initialAvatar={avatar}
          initialCoins={coins}
          onSignOut={handleSignOut}
          startInStore={startInStore}
        />
      ) : (
        <main className="min-h-screen">
          <UserProfileModal onSave={handleSaveProfile} />
        </main>
      ))}
    </div>
  );
}

export default function Home() {
  return <GameHubShell />;
}
