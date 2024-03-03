"use client";

import usePlayer from "@/app/hooks/usePlayer";
import { Song } from "@/types";
import { useEffect, useState } from "react";
import { PlayerConent } from "./PlayerContent";

export function Player() {
  const player = usePlayer();
  const [song, setSong] = useState<Song>({} as Song);

  useEffect(() => {
    console.log("UPDATE");
    async function fetchData() {
      if (!player.activeId) return;

      const songs = await fetch("/api/getSongsByIds", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
        body: JSON.stringify({
          ids: [player.activeId],
          getRealSongUrl: true,
        }),
      }).then((res) => res.json());

      if (songs.message) return; // Means we got an error
      songs[0].song_url = "/api/getSongAudio?id=" + songs[0].id;

      setSong(songs[0]);
    }

    fetchData();
  }, [player.activeId]);

  if (!player.activeId || !song || !song.song_url) return null;

  return (
    <div className="fixed bottom-0 bg-black w-full py-2 h-[80px] px-4">
      <PlayerConent key={song.song_url} song={song} songUrl={song.song_url} />
    </div>
  );
}
