import { Pack } from "@/types";
import { checkSongCover } from "./utils";
import axios from "axios";

export async function getPacks({
  access_token,
}: {
  access_token: string;
}): Promise<Pack[]> {
  if (access_token === "") return [];

  try {
    const packType = "artist";
    const data = await axios
      .get(`https://osu.ppy.sh/api/v2/beatmaps/packs?type=${packType}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => res.data);

    if (!data) {
      return [];
    }

    const packsPromises = data.beatmap_packs.map(async (pack: any) => {
      // ! TODO: Heavy ratelimits, disable for now
      // const packData = await axios
      //   .get(
      //     `https://osu.ppy.sh/api/v2/beatmaps/packs/${pack.tag}?legacy_only=1`,
      //     {
      //       headers: {
      //         "Content-Type": "application/json",
      //         Accept: "application/json",
      //         Authorization: `Bearer ${access_token}`,
      //       },
      //     }
      //   )
      //   .then((res) => res.data);

      // if (packData?.beatmapsets?.length !== 0)
      //   await checkSongCover(packData.beatmapsets[0]);

      return {
        id: pack.tag.toString(),
        author: pack.author,
        title: pack.name,
        thumbnail: "/images/unknown.jpg",
      };
    });

    const packs = await Promise.all(packsPromises);

    return packs;
  } catch (err) {
    console.error(err);
    return [];
  }
}
