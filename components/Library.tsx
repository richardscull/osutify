import { Pack } from "@/types";
import { TbPlaylist } from "react-icons/tb";
import { MediaItem } from "./MediaItem";
import { useRouter } from "next/navigation";

interface LibraryProps {
  packs: Pack[];
}

export function Library({ packs }: LibraryProps) {
  const router = useRouter();
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist size={26} className="text-neutral-400" />
          <p className="text-neutral-400 font-medium">Public playlists</p>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 mt-4 px-3">
        {packs.map((item) => (
          <MediaItem
            key={item.id}
            onClick={() => router.push(`/playlist/${item.id}`)}
            data={item}
          />
        ))}
      </div>
    </div>
  );
}
