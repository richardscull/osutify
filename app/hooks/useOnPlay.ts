import { Song } from "@/types";
import usePlayer from "./usePlayer";

export default function useOnPlay(songs: Song[]) {
  const player = usePlayer();

  const onPlay: (id: string) => void = (id) => {
    console.log("setId ", id);
    player.setId(id);
    player.setIds(songs.map((song) => song.id));
  };

  return onPlay;
}
