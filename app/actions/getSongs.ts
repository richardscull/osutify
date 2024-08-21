import { Song } from "@/types";
import { checkSongCover } from "./utils";
import axios from "axios";

export async function getSongs(
  token: string,
  cursor?: string | null
): Promise<{ cursor: string | null; songs: Song[] }> {
  try {
    const { beatmapsets, cursor_string } = await axios
      .get(
        `https://osu.ppy.sh/api/v2/beatmapsets/search?cursor_string=${cursor}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => res.data);

    if (!beatmapsets) {
      return { cursor: null, songs: [] };
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

    return { cursor: cursor_string, songs };
  } catch (err) {
    console.error(err);
    return { cursor: null, songs: [] };
  }
}
