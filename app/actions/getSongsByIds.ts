import { Song } from "@/types";

export async function getSongsByIds(
  ids: string[],
  access_token: string
  // Since we cant use this function without acessing local storage,
  // we cant access "next/headers" here, so its one way to pass it as a parameter (or me just dumb dumb)
): Promise<Song[]> {
  if (access_token === "") return [];

  const beatmapsets = [];
  for (let i = 0; i < ids.length; i++) {
    const data = await fetch(
      `https://osu.ppy.sh/api/v2/beatmapsets/${ids[i]}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    ).then((res) => res.json());
    beatmapsets.push(data);
  }

  if (!beatmapsets) {
    return [];
  }

  const songs = beatmapsets.map((song: any) => ({
    id: song.id,
    author: song.artist,
    title: song.title,
    song_url: song.preview_url, 
    thumbnail: song.covers.cover,
  }));

  return songs;
}
