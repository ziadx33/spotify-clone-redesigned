import { type Playlist } from "@prisma/client";
import { Player } from "./player";

type MusicPlayerProps = {
  id: Playlist["id"];
};

export function MusicPlayer({ id }: MusicPlayerProps) {
  return (
    <>
      <Player id={id} />
    </>
  );
}
