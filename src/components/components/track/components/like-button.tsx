import { useUserData } from "@/hooks/use-user-data";
import { type Track } from "@prisma/client";
import { CiHeart } from "react-icons/ci";

export function LikeButton({ track }: { track?: Track }) {
  const user = useUserData();
  return (
    <button className="ml-4  opacity-0 transition-opacity group-hover:opacity-100">
      <CiHeart size={20} className="fill-primary text-primary" />
    </button>
  );
}
