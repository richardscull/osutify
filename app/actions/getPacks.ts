import { Pack } from "@/types";
import { cookies } from "next/headers";

export async function getPacks(): Promise<Pack[]> {
  const cookieStore = cookies();
  if (!cookieStore.get("osu_access_token")) return [];

  const packType = "artist";

  const data = await fetch(
    `https://osu.ppy.sh/api/v2/beatmaps/packs?type=${packType}`,
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

  const packsPromises = data.beatmap_packs.map(async (pack: any) => {
    const packData = await fetch(
      `https://osu.ppy.sh/api/v2/beatmaps/packs/${pack.tag}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${cookieStore.get("osu_access_token")?.value}`,
        },
      }
    ).then((res) => res.json());

    if (
      packData?.beatmapsets?.length !== 0 &&
      (await checkIfAccessable(packData?.beatmapsets[0]?.covers?.cover))
        .status !== 200
    )
      packData.beatmapsets[0].covers.cover = `https://osu.ppy.sh/assets/images/default-bg.7594e945.png`;

    return {
      id: pack.tag.toString(),
      author: pack.author,
      title: pack.name,
      thumbnail: packData.beatmapsets[0].covers.cover,
    };
  });

  const packs = await Promise.all(packsPromises);

  return packs;
}

async function checkIfAccessable(url: string) {
  return await fetch(url);
}
