import { type Playlist } from "@prisma/client";
import { Player } from "./player";
import { Tracks } from "./tracks";

type MusicPlayerProps = {
  id: Playlist["id"];
};

export function MusicPlayer({ id }: MusicPlayerProps) {
  return (
    <>
      <Player id={id} />
      <Tracks id={id} />
    </>
  );
}
