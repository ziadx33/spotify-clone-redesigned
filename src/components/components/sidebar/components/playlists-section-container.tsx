import { useDrop } from "@/hooks/use-drop";
import { useFollow } from "@/hooks/use-follow";
import { usePrefrences } from "@/hooks/use-prefrences";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import { getArtistById } from "@/server/actions/user";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

export function PlaylistsSectionContainer({
  children,
}: {
  children: ReactNode;
}) {
  const { data } = usePrefrences();
  const { data: user } = useSession();
  const { follow } = useFollow({ playlistId: "unkown" });
  const [isDropping, setIsDropping] = useState(false);
  const { ref } = useDrop<HTMLDivElement>(
    "artistId",
    async (id) => {
      setIsDropping(false);
      const artist = await getArtistById(id);
      if (user?.user?.id && artist?.followers.includes(user?.user?.id))
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
        "rounded-lg border-2 border-transparent transition-all",
        isDropping ? "border-primary" : "border-transparent",
        data?.showSidebar ? "w-24 px-2" : "w-full px-4",
      )}
      ref={ref}
    >
      {children}
    </div>
  );
}
