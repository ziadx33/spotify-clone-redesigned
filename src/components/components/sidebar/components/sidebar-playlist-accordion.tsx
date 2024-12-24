import { PlaylistContext } from "@/components/contexts/playlist-context";
import { SidebarItem } from "./sidebar-item";
import { RiFolderMusicLine } from "react-icons/ri";
import { type Playlist } from "@prisma/client";
import { usePathname } from "next/navigation";
import { useDrop } from "@/hooks/use-drop";
import { addTrackToPlaylistToDB } from "@/server/actions/track";
import { toast } from "sonner";

export function SidebarPlaylistAccordion({ playlist }: { playlist: Playlist }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(`/playlist/${playlist.id}`);
  const { ref: dropRef } = useDrop<HTMLDivElement>(
    "trackId",
    async (trackId) => {
      dropRef.current?.classList.add("border-transparent");
      dropRef.current?.classList.remove("border-primary");
      toast.promise(
        addTrackToPlaylistToDB({ trackId, playlistId: playlist.id }),
        {
          loading: "Adding track to playlist...",
          success: "Track added to playlist!",
          error: "Failed to add track to playlist",
        },
      );
    },
    () => {
      dropRef.current?.classList.remove("border-transparent");
      dropRef.current?.classList.add("border-primary");
    },
    (e) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        dropRef.current?.classList.add("border-transparent");
        dropRef.current?.classList.remove("border-primary");
      }
    },
  );
  return (
    <PlaylistContext playlist={playlist} asChild={false} key={playlist.id}>
      <div
        ref={dropRef}
        className="rounded-md border-2 border-transparent transition-colors duration-200 ease-in-out"
      >
        <SidebarItem active={isActive} href={`/playlist/${playlist.id}`}>
          <RiFolderMusicLine size={18} />
          {playlist.title}
        </SidebarItem>
      </div>
    </PlaylistContext>
  );
}
