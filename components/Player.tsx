"use client";

import usePlayer from "@/app/hooks/usePlayer";
import { Song } from "@/types";
import { useEffect, useState } from "react";
import { PlayerConent } from "./PlayerContent";
import axios, { AxiosRequestConfig } from "axios";

export function Player() {
  const player = usePlayer();
  const [song, setSong] = useState<Song>({} as Song);

  useEffect(() => {
    async function fetchData() {
      if (!player.activeId) return;

      // Still don't know why some requests being cancelled,
      // so I went with timeout and retries to fix it

      const songs = await axiosWithRetry(
        "/api/getSongsByIds",
        {
          ids: [player.activeId],
          getRealSongUrl: true,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 1000,
        }
      ).catch((err) => {
        console.error(err);
        return { message: "Error" };
      });

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

async function axiosWithRetry(
  url: string,
  data: any,
  config: AxiosRequestConfig<any> | undefined,
  retries = 3
) {
  try {
    const response = await axios.post(url, data, config);
    return response.data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Request timed out. Retrying... (${retries} retries left)`);
      return axiosWithRetry(url, data, config, retries - 1);
    } else {
      throw error;
    }
  }
}
