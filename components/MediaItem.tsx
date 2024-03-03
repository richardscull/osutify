"use client";

import { Pack, Song } from "@/types";
import Image from "next/image";

interface MediaItemProps {
  data: Pack | Song;
  onClick?: (id: string) => void;
}

export function MediaItem({ data, onClick }: MediaItemProps) {
  function handleClick() {
    if (onClick) onClick(data.id);
  }

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md"
    >
      <div className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
        <Image
          fill
          src={data.thumbnail || "/images/unknown.jpg"}
          alt="Image"
          className="object-cover"
          loading="lazy"
          blurDataURL="/images/unknown.jpg"
          placeholder="blur"
        />
      </div>
      <div className="flex flex-col gap-y-1 overflow-hidden">
        <p className="font-semibold text-neutral-100 truncate w-full">
          {data.title}
        </p>
        <p className="text-neutral-400 text-sm truncate w-full">
          {data.author}
        </p>
      </div>
    </div>
  );
}
