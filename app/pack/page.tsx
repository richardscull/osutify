import { Header } from "@/components/Header";
import { getSongsByQuery } from "../actions/getSongsByQuery";
import { SearchInput } from "@/components/SearchInput";

interface SearchProps {
  searchParams: { query: string };
}

export const revalidate = 0;

// TODO: WORRY ABOUT THIS LATER

export default async function Search({ searchParams }: SearchProps) {
  const songs = await getSongsByQuery("");
  //await getSongsByPackTag(searchParams.packTag);

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      wip :D
      {/* <SearchContent songs={songs} /> */}
    </div>
  );
}
