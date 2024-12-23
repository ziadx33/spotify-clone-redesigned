import { useDrop } from "@/hooks/use-drop";
import { useFollow } from "@/hooks/use-follow";
import { useUserData } from "@/hooks/use-user-data";
import { cn } from "@/lib/utils";
import { getArtistById } from "@/server/actions/user";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

export function PlaylistsSectionContainer({
  children,
}: {
  children: ReactNode;
}) {
  const user = useUserData();
  const { follow } = useFollow({ playlistId: "unkown" });
  const [isDropping, setIsDropping] = useState(false);
  const { ref } = useDrop<HTMLDivElement>(
    "artistId",
    async (id) => {
      setIsDropping(false);
      const artist = await getArtistById(id);
      if (user?.id && artist?.followers.includes(user?.id))
        return toast.error("already followed artist");
      if (!artist) return toast.error("Something went wrong");
      await follow(artist);
      toast.success(`Followed ${artist.name} successfully!`);
    },
    () => {
      setIsDropping(true);
    },
    (e) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDropping(false);
      }
    },
  );
  return (
    <div
      className={cn(
        "w-full rounded-lg border-2 border-transparent transition-all",
        isDropping ? "border-primary" : "border-transparent",
      )}
      ref={ref}
    >
      {children}
    </div>
  );
}
