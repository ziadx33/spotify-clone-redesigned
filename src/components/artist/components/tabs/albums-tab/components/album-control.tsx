import { Button } from "@/components/ui/button";
import { BsThreeDots } from "react-icons/bs";
import { FaPlay, FaRegArrowAltCircleDown } from "react-icons/fa";
import { type Playlist } from "@prisma/client";
import { AddLibraryButton } from "@/components/components/add-library-button";
import {
  QueuePlayButton,
  type QueuePlayButtonProps,
} from "@/components/queue-play-button";

type AlbumControlProps = {
  playlist: Playlist;
  data: QueuePlayButtonProps["data"];
};

export function AlbumControl({ playlist, data }: AlbumControlProps) {
  return (
    <div className="flex items-center">
      <QueuePlayButton
        data={data}
        size={"icon"}
        className="mr-2 h-8 w-8 rounded-full"
      >
        <FaPlay size={12} />
      </QueuePlayButton>
      <Button size={"icon"} variant="ghost" className="h-10 w-10 rounded-full">
        <FaRegArrowAltCircleDown size={20} />
      </Button>
      <AddLibraryButton size={40} divideBy={20} playlist={playlist} />
      <Button size={"icon"} variant="ghost" className="h-10 w-10 rounded-full">
        <BsThreeDots size={20} />
      </Button>
    </div>
  );
}
