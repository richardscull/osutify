import { Song } from "@/types";
import { checkSongCover } from "./utils";
import axios from "axios";

export async function getSongsByIds(
  ids: string[],
  access_token: string
  // Since we cant use this function without acessing local storage,
  // we cant access "next/headers" here, so its one way to pass it as a parameter (or me just dumb dumb)
): Promise<Song[]> {
  if (access_token === "") return [];

  const beatmapsets = await Promise.all(
    ids.map(async (id) => {
      const data = await axios
        .get(`https://osu.ppy.sh/api/v2/beatmapsets/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then((res) => res.data);
      return data;
    })
  );

  if (!beatmapsets) {
    return [];
  }

  await Promise.all(
    beatmapsets.map(async (song: any) => {
      await checkSongCover(song);
    })
  );

  const songs = beatmapsets.map((song: any) => ({
    id: song.id,
    author: song.artist,
    title: song.title,
    song_url: song.preview_url,
    thumbnail: song.covers.cover,
  }));

  return songs;
}
