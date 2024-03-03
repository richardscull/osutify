import { Song } from "@/types";
import { cookies } from "next/headers";

export async function getSongsByQuery(
  query: string,
  showUnranked: boolean = false
): Promise<Song[]> {
  const cookieStore = cookies();
  if (!cookieStore.get("osu_access_token")) return [];

  const data = await fetch(
    `https://osu.ppy.sh/api/v2/beatmapsets/search?q=${query}${
      showUnranked ? "&s=any" : "&s=ranked"
    }`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${cookieStore.get("osu_access_token")?.value}`,
      },
    }
  ).then((res) => res.json());

  if (!data) {
    return [];
  }

  const songs = data.beatmapsets.map((song: any) => ({
    id: song.id,
    author: song.artist,
    title: song.title,
    song_url: song.preview_url, 
    thumbnail: song.covers.cover,
  }));

  return songs;
}
