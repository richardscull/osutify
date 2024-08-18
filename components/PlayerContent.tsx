"use client";

import useSound from "use-sound";
import { Song } from "@/types";
import { MediaItem } from "./MediaItem";
import { LikeButton } from "./LikeButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { useEffect, useRef, useState } from "react";
import { TbRepeat, TbRepeatOff } from "react-icons/tb";
import { BiShuffle } from "react-icons/bi";
import { VscLoading } from "react-icons/vsc";
import usePlayer from "@/app/hooks/usePlayer";
import Slider from "./Slider";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

export function PlayerConent({ song, songUrl }: PlayerContentProps) {
  const player = usePlayer();
  const [currentSeek, setCurrentSeek] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const loopRef = useRef(player.loop);

  const Icon = isLoading ? VscLoading : isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = player.volume === 0 ? HiSpeakerXMark : HiSpeakerWave;
  const LoopIcon = player.loop === true ? TbRepeat : TbRepeatOff;

  useEffect(() => {
    loopRef.current = player.loop;
  }, [player.loop]);

  function onPlayNext() {
    if (player.songs.length === 0) return;
    if (sound?.loop() === true) return handleSeek(0);

    const currentIndex = player.songs.indexOf(
      player.activeSong || ({} as Song)
    );
    const nextSong = player.songs[currentIndex + 1];

    if (!nextSong) return player.setSong(player.songs[0]);
    player.setSong(nextSong);
  }

  const onPlayPrevious = () => {
    if (player.songs.length === 0) return;
    if (sound?.loop() === true) return handleSeek(0);

    const currentIndex = player.songs.indexOf(
      player.activeSong || ({} as Song)
    );
    const previousSong = player.songs[currentIndex - 1];

    if (!previousSong)
      return player.setSong(player.songs[player.songs.length - 1]);
    player.setSong(previousSong);
  };

  const [play, { pause, duration, sound }] = useSound(songUrl, {
    volume: player.volume,
    loop: player.loop,
    onplay: () => {
      setIsPlaying(true);
      sound?.volume(player.volume);
    },
    onend: () => {
      setIsPlaying(false);
      if (loopRef.current === false) onPlayNext();
    },
    onpause: () => {
      setIsPlaying(false);
    },
    format: ["mp3"],
    html5: true,
  });

  useEffect(() => {
    sound?.play();
    if (sound) setIsLoading(false);

    const seekInterval = setInterval(() => {
      if (!sound) return;
      setCurrentSeek(Math.round(sound?.seek()));
    }, 1000);

    return () => {
      clearInterval(seekInterval);
      sound?.unload();
    };
  }, [sound]);

  const handlePlay = () => {
    !isPlaying ? play() : pause();
  };

  const toggleMute = () => {
    player.volume === 0 ? player.setVolume(1) : player.setVolume(0);
  };

  const changeLoop = () => {
    sound?.loop(!player.loop);
    player.setLoop(!player.loop);
  };

  const handleSeek = (value: number) => {
    setCurrentSeek(value);
    sound?.seek(value);
  };

  const openBeatmap = (id: string) => {
    window.open(`https://osu.ppy.sh/beatmapsets/${id}`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full ">
      <div className="flex w-full justify-start mb-12">
        <div className="flex items-center gap-x-4 ">
          {song.title.length > 45 ? (
            <MediaItem data={song} truncate={true} onClick={openBeatmap} />
          ) : (
            <MediaItem data={song} onClick={openBeatmap} />
          )}

          <LikeButton songId={song.id} />
        </div>
      </div>

      <div className="flex md:hidden col-auto w-full justify-end items-center mb-12">
        <div
          onClick={handlePlay}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer"
        >
          <Icon
            size={30}
            className={`text-black ${isLoading ? "animate-spin" : ""}`}
          />
        </div>
      </div>

      <div className="hidden h-full md:flex flex-col w-full max-w-[722px] gap-x-6 ">
        <div className="md:flex justify-center items-center gap-x-6">
          <BiShuffle className="cursor-not-allowed text-neutral-700" />
          <AiFillStepBackward
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
            onClick={onPlayPrevious}
          />
          <div
            onClick={handlePlay}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer"
          >
            <Icon
              size={30}
              className={`text-black ${isLoading ? "animate-spin" : ""}`}
            />
          </div>
          <AiFillStepForward
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
            onClick={onPlayNext}
          />
          <LoopIcon className="cursor-pointer" onClick={changeLoop} />
        </div>
        <div className="w-full flex items-center justify-center gap-x-4 font-light">
          <p className="text-neutral-400 text-sm">
            {millisecondsToString(currentSeek * 1000 || 0)}
          </p>
          <Slider
            value={currentSeek}
            onChange={handleSeek}
            max={Math.floor((duration || 1) / 1000)}
            step={1}
          />
          <p className="text-neutral-400 text-sm">
            {millisecondsToString(duration || 0)}
          </p>
        </div>
      </div>

      <div className="hidden md:flex w-full justify-end pr-2 mb-12">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon
            size={34}
            className="cursor-pointer"
            onClick={toggleMute}
          />
          <Slider
            value={player.volume}
            onChange={(value) => player.setVolume(value)}
          />
        </div>
      </div>
    </div>
  );
}

function millisecondsToString(ms: number): string {
  const date = new Date(ms);
  let hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  if (hours === "00") {
    hours = "";
  } else {
    hours += ":";
  }
  return `${hours}${minutes}:${seconds}`;
}
