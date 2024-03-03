export async function checkSongCover(song: any) {
  const url = song.covers.cover;
  const isAccessable = (await checkIfAccessable(url)).status === 200;
  if (!isAccessable)
    song.covers.cover = `https://osu.ppy.sh/assets/images/default-bg.7594e945.png`;
}

async function checkIfAccessable(url: string) {
  return await fetch(url);
}
