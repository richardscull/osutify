"use client";

import useOnPlay from "@/app/hooks/useOnPlay";
import { LikeButton } from "@/components/LikeButton";
import { MediaItem } from "@/components/MediaItem";
import { Song } from "@/types";

interface SearchContentProps {
  songs: Song[];
}

function SearchContent({ songs }: SearchContentProps) {
  const onPlay = useOnPlay(songs);
  if (songs.length === 0) {
    return (
      <div
        className="
          flex 
          flex-col 
          gap-y-2 
          w-full 
          px-6 
          text-neutral-400
        "
      >
        No songs found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 w-full px-6">
      {songs.map((song: Song, index: number) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full">
          <p className="text-neutral-400 text-center" style={{ width: "30px" }}>
            {index + 1}
          </p>
          <div className="flex-1">
            <MediaItem onClick={(id: string) => onPlay(id)} data={song} />
          </div>
          <LikeButton songId={song.id} />
        </div>
      ))}
    </div>
  );
}

export default SearchContent;
