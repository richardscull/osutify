"use client";
import { Song } from "@/types";
import { SongItem } from "./SongItem";

interface PageContentProps {
  songs: Song[];
}

export function PageContent({ songs }: PageContentProps) {
  if (songs.length === 0) {
    return <div className="mt-4 text-neutral-400">No songs found</div>;
  }

  //console.log(songs);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 mt-4">
      {songs.map((item) => (
        <SongItem key={item.id} onClick={() => {}} data={item} />
      ))}
    </div>
  );
}
