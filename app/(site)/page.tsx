"use client";

import { Header } from "@/components/Header";
import { ListItem } from "@/components/ListItem";
import { PageContent } from "./components/PageContent";
import { Greeting } from "@/components/Greeting";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { Song } from "@/types";
import axios from "axios";

export default function Home() {
  const { ref, inView } = useInView();
  const [songs, setSongs] = useState<Song[]>([]);
  const [cursor, setCursor] = useState<string | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!inView || cursor === null || loading) return;

    setLoading(true);
    axios
      .post("/api/getSongsByQuery", {
        cursor,
      })
      .then((res) => res.data)
      .then(({ cursor, songs }) => {
        setCursor(cursor);
        setSongs((prev) => [...prev, ...songs]);
        setLoading(false);
      });
  }, [inView, cursor, loading]);

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <Greeting />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
            <ListItem
              image="/images/liked.png"
              name="Liked Songs"
              href="liked"
            />
          </div>
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">Newest songs</h1>
        </div>
        <PageContent songs={songs} loading={loading} />
        <div ref={ref}></div>
      </div>
    </div>
  );
}
