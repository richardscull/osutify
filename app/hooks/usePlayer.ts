import { Song } from "@/types";
import { create } from "zustand";

interface PlayerStore {
  songs: Song[];
  activeSong?: Song;
  volume?: number;
  loop?: boolean;
  setSong: (song: Song) => void;
  setSongs: (ids: Song[]) => void;
  setVolume: (volume: number) => void;
  setLoop: (loop: boolean) => void;
  reset: () => void;
}

const usePlayer = create<PlayerStore>((set) => ({
  songs: [],
  activeSong: undefined,
  volume: 1,
  loop: false,
  setSong: (song: Song) => set({ activeSong: song }),
  setSongs: (songs: Song[]) => set({ songs: songs }),
  setVolume: (volume: number) => set({ volume: volume }),
  setLoop: (loop: boolean) => set({ loop: loop }),
  reset: () => set({ songs: [], activeSong: undefined }),
}));

export default usePlayer;
