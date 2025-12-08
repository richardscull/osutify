import { Song } from "@/types";
import { checkSongCover } from "./utils";
import axios from "axios";

export interface GetPackResponse {
  packName: string;
  songs: Song[];
}

export async function getPack({
  tag,
  access_token,
}: {
  tag: string;
  access_token: string;
}): Promise<GetPackResponse> {
  if (access_token === "" || tag === "")
    return { packName: "Not found", songs: [] };

  try {
    const data = await axios
      .get(`https://osu.ppy.sh/api/v2/beatmaps/packs/${tag}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => res.data);

    const { beatmapsets } = data;

    if (!beatmapsets) return { packName: "Not found", songs: [] };

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

    return { packName: data.name, songs };
  } catch (err) {
    console.error(err);
    return { packName: "Not found", songs: [] };
  }
}
