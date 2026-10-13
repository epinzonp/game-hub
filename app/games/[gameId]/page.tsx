import { notFound } from "next/navigation";
import { GameHubShell } from "@/app/page";
import { isGameRouteId } from "@/lib/game-routes";

export default async function GamePage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  if (!isGameRouteId(gameId)) notFound();

  return <GameHubShell initialGame={gameId} />;
}
