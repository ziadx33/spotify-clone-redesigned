import { type PlaylistPageProps } from "..";
import EditableData from "../components/editable-data";
import { MoreAlbums } from "../components/more-albums";
import { MusicPlayer } from "../components/music-player";
import { Recommended } from "../components/recommended";

export function Playlist({
  creatorData,
  tracks,
  data,
  type,
  id,
}: PlaylistPageProps) {
  return (
    <div className="flex h-fit min-h-full w-full flex-col">
      <EditableData
        creatorData={creatorData?.creatorData}
        data={data}
        tracks={tracks?.data?.tracks ?? []}
        type={type}
      />
      <div className="flex h-fit w-full flex-col gap-4 px-8 pb-4">
        <MusicPlayer playlist={data} />
        {type === "ALBUM" ? (
          <MoreAlbums
            artist={creatorData?.creatorData}
            playlist={data}
            data={creatorData?.playlists}
          />
        ) : (
          <Recommended
            playlistId={id}
            tracks={tracks?.data?.tracks}
            playlist={data}
            artists={tracks?.data?.authors}
          />
        )}
      </div>
    </div>
  );
}
