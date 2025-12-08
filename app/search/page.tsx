"use client";
import { Header } from "@/components/Header";
import { SearchInput } from "@/components/SearchInput";
import SearchContent from "./components/SearchContent";
import { use, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Song } from "@/types";
import axios from "axios";

interface SearchProps {
  searchParams: Promise<{ query: string }>;
}

export default function Search({ searchParams }: SearchProps) {
  const { query } = use(searchParams);
  const { ref, inView } = useInView();
  const [songs, setSongs] = useState<Song[]>([]);
  const [cursor, setCursor] = useState<string | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSongs([]);
    setCursor(undefined);
  }, [query]);

  useEffect(() => {
    if (!inView || cursor === null || loading) return;

    setLoading(true);
    axios
      .post("/api/getSongsByQuery", {
        query: query,
        cursor,
      })
      .then((res) => res.data)
      .then(({ cursor, songs }) => {
        setCursor(cursor);
        setSongs((prev) => [...prev, ...songs]);
        setLoading(false);
      });
  }, [inView, cursor, query, loading]);

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">Search</h1>
          <SearchInput />
        </div>
      </Header>
      <SearchContent songs={songs} loading={loading} />
      <div ref={ref}></div>
    </div>
  );
}
