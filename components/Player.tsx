"use client";

import usePlayer from "@/app/hooks/usePlayer";
import { PlayerConent } from "./PlayerContent";

export function Player() {
  const player = usePlayer();
  if (!player.activeSong) return null;

  const songUrl = "/api/getSongAudio?id=" + player.activeSong.id;
  return (
    <div className="fixed bottom-0 bg-black w-full py-2 h-[80px] px-4">
      <PlayerConent key={songUrl} song={player.activeSong} songUrl={songUrl} />
    </div>
  );
}
