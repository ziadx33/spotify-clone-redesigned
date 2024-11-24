import { Button } from "@/components/ui/button";
import { BsThreeDots } from "react-icons/bs";
import { FaPause, FaPlay } from "react-icons/fa";
import { type Track, type User, type Playlist } from "@prisma/client";
import { AddLibraryButton } from "@/components/components/add-library-button";
import { QueuePlayButton } from "@/components/queue-play-button";
import { PlaylistDropdown } from "@/components/dropdowns/playlist-dropdown";

type AlbumControlProps = {
  playlist: Playlist;
  tracks: Track[];
  author?: User;
};

export function AlbumControl({ playlist, tracks, author }: AlbumControlProps) {
  return (
    <div className="flex items-center">
      <QueuePlayButton
        data={{
          tracks: {
            tracks,
            albums: [playlist],
            authors: author ? [author] : [],
          },
          data: {
            currentPlaying: tracks[0]?.id ?? "",
            trackList: tracks.map((track) => track.id),
            type: "PLAYLIST",
            typeId: playlist.id,
          },
          typePlaylist: playlist,
        }}
        size="sm"
        className="mr-2 rounded-full"
      >
        {(isPlaying) => {
          return !isPlaying ? <FaPlay /> : <FaPause />;
        }}
      </QueuePlayButton>
      <AddLibraryButton size={40} divideBy={20} playlist={playlist} />
      <PlaylistDropdown playlist={playlist}>
        <Button
          size={"icon"}
          variant="ghost"
          className="h-10 w-10 rounded-full"
        >
          <BsThreeDots size={20} />
        </Button>
      </PlaylistDropdown>
    </div>
  );
}
