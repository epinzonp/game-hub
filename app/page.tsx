"use client";
import GameHub from "@/app/components/GameHub";
import UserProfileModal from "@/app/components/UserProfileModal";
import { useEffect, useState } from "react";

export default function Home() {

  const [profile, setProfile] = useState<{ name: string; country: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("user-profile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleSaveProfile = (data: { name: string; country: string }) => {
    localStorage.setItem("user-profile", JSON.stringify(data));
    setProfile(data);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-zinc-950 text-zinc-50">
      {!profile && <UserProfileModal onSave={handleSaveProfile} />}
      <GameHub />
    </main>
  );
}
