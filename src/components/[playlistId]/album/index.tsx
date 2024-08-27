import { type PlaylistPageProps } from "..";
import { MoreAlbums } from "../components/more-albums";
import { MusicPlayer } from "./components/music-player";
import { EditableData } from "./components/editable-data";

export function Album({ creatorData, data }: PlaylistPageProps) {
  return (
    <div className="flex h-fit min-h-full w-full flex-col">
      <EditableData creatorData={creatorData?.creatorData} data={data}>
        <div className="flex h-fit w-full flex-col gap-4 pb-4">
          <MusicPlayer playlist={data} />
          <MoreAlbums
            artist={creatorData?.creatorData}
            playlist={data}
            data={creatorData?.playlists}
          />
        </div>
      </EditableData>
    </div>
  );
}
