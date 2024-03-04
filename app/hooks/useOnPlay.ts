import { Song } from "@/types";
import usePlayer from "./usePlayer";

export default function useOnPlay(songs: Song[]) {
  const player = usePlayer();

  const onPlay: (id: string) => void = (id) => {
    player.setSong(songs.find((song) => song.id === id) as Song);
    player.setSongs(songs);
  };

  return onPlay;
}
