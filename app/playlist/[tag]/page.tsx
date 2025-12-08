"use client";
import Image from "next/image";
import { Header } from "@/components/Header";
import { GetPackResponse } from "@/app/actions/getPack";
import PlaylistContent from "./components/PlaylistContent";
import { use, useEffect, useState } from "react";
import axios from "axios";

export default function Playlist({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = use(params);

  const [data, setData] = useState<GetPackResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { packName, songs } = data || { packName: "", songs: [] };

  useEffect(() => {
    if (isLoading || data) return;

    setIsLoading(true);
    axios
      .post("/api/getPack", { tag })
      .then((res) => res.data)
      .then(({ packName, songs }) => {
        setData({ packName, songs });
        setIsLoading(false);
      });
  }, [tag, data, isLoading]);

  return (
    <div
      className="
        bg-neutral-900 
        rounded-lg 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
      "
    >
      <Header>
        <div className="mt-20">
          <div
            className="
              flex 
              flex-col 
              md:flex-row 
              items-center 
              gap-x-5
            "
          >
            <div className="relative h-32 w-32 lg:h-44 lg:w-44">
              <Image
                className="object-cover rounded-lg shadow-2xl shadow-black"
                fill
                src={songs?.[0]?.thumbnail || "/images/unknown.jpg"}
                alt="Playlist"
                loading="lazy"
                blurDataURL="/images/unknown.jpg"
                placeholder="blur"
                unoptimized
              />
            </div>
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <p className="hidden md:block font-semibold text-sm">Playlist</p>
              <h1
                className="
                  text-white 
                  text-4xl 
                  sm:text-5xl 
                  lg:text-7xl 
                  font-bold
                "
              >
                {packName || "Unknown Playlist"}
              </h1>
            </div>
          </div>
        </div>
      </Header>
      <PlaylistContent songs={songs} />
    </div>
  );
}
