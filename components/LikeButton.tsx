import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface LikeButtonProps {
  songId: string;
}

export function LikeButton({ songId }: LikeButtonProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    const likedSongs = localStorage.getItem("liked_songs");

    if (likedSongs) {
      const parsedLikedSongs = JSON.parse(likedSongs);
      if (parsedLikedSongs.includes(songId)) {
        setIsLiked(true);
      }
    }
  }, [songId]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {
    const likedSongs = localStorage.getItem("liked_songs");
    if (!likedSongs) localStorage.setItem("liked_songs", JSON.stringify([]));
    const parsedLikedSongs = JSON.parse(likedSongs || "[]");

    if (isLiked) {
      const filteredLikedSongs = parsedLikedSongs.filter(
        (likedSong: string) => likedSong !== songId
      );
      localStorage.setItem("liked_songs", JSON.stringify(filteredLikedSongs));
      setIsLiked(false);
    } else {
      localStorage.setItem(
        "liked_songs",
        JSON.stringify([...parsedLikedSongs, songId])
      );
      setIsLiked(true);
    }

    router.refresh();
  };

  return (
    <button
      className="
        cursor-pointer 
        hover:opacity-75 
        transition
      "
      onClick={handleLike}
    >
      <Icon color={isLiked ? "#22c55e" : "white"} size={25} />
    </button>
  );
}
