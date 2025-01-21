"use client";

import { useMiniMenu } from "@/hooks/use-mini-menu";
import { useUserData } from "@/hooks/use-user-data";
import { cn } from "@/lib/utils";
import { type Playlist } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { Author } from "@/components/[playlistId]/album/components/author";
import { type TracksSliceType } from "@/state/slices/tracks";
import { MusicPlayer } from "@/components/[playlistId]/components/music-player";
import { GenresSelect } from "./components/genres-select";
import { AlbumImage } from "./components/album-image";
import { AlbumTitle } from "./components/album-title";
import { TracksData } from "./components/tracks-data";
import { CreateTrackContainer } from "./components/create-track-container";
import { Button } from "@/components/ui/button";
import { useNewAlbumActions } from "@/hooks/use-new-album-actions";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getTracksByPlaylistId } from "@/server/actions/track";
import { getPlaylist } from "@/server/actions/playlist";
import { TracksTable } from "./components/tracks-table";

export type TempTrackType = { id: string; edit: boolean };

export function NewAlbum() {
  const { value: miniMenuValue } = useMiniMenu();
  const creatorData = useUserData();
  const searchParams = useSearchParams();
  const playlistId = searchParams.get("playlist");
  const { data: playlistData, isLoading } = useQuery({
    queryKey: [`artist-album-edit`, playlistId],
    queryFn: async () => {
      if (!playlistId) return null;
      const tracks = await getTracksByPlaylistId(playlistId);
      const playlist = await getPlaylist(playlistId);
      return { tracks, playlist };
    },
    enabled: !!playlistId,
  });
  const [data, setData] = useState<Playlist>({
    id: crypto.randomUUID(),
    title: "Title Here",
    createdAt: new Date(),
    creatorId: creatorData.id,
    description: "description here...",
    genres: [],
    imageSrc: "/images/no-image-playlist.png",
    visibility: "PUBLIC",
    folderId: null,
    type: "ALBUM",
  });
  const [tracks, setTracks] = useState<TracksSliceType["data"]>({
    albums: [],
    authors: [creatorData],
    tracks: [],
  });
  const isDone = useRef(false);
  useEffect(() => {
    if (isDone.current) return;
    if (playlistData) {
      isDone.current = true;
      setData(playlistData.playlist ?? data);
      setTracks(playlistData.tracks?.data ?? tracks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlistData]);
  const [tempTracksNum, setTempTracksNum] = useState<TempTrackType[]>([
    { id: crypto.randomUUID(), edit: false },
  ]);
  const [albumImage, setAlbumImage] = useState<File | null>(null);
  const editedTrackIds = useRef<string[]>([]);
  const { submitHandler, submitTransition, deleteTrackHandler, editHandler } =
    useNewAlbumActions({
      albumImage,
      data,
      tracks,
      setTracks,
    });
  return (
    <div>
      <div
        className={cn(
          "flex justify-between gap-x-4 p-8 pb-6",
          miniMenuValue ? "flex-col" : "",
        )}
      >
        <div className="flex w-[95%] flex-col">
          <AlbumTitle data={data} setData={setData} disabled={isLoading} />
          <div className="flex gap-1.5">
            <TracksData data={data} tracks={tracks} />
          </div>
          <div className="flex size-full flex-col gap-4 pb-4">
            <MusicPlayer disabled newAlbum showExploreButton={false} />
            <TracksTable
              setTempTracksNum={setTempTracksNum}
              tempTracksNum={tempTracksNum}
              tracks={tracks}
              isLoading={isLoading}
              deleteTrackHandler={deleteTrackHandler}
              playlistId={playlistId}
              editedTrackIds={editedTrackIds}
            />
            {!isLoading && (
              <CreateTrackContainer
                editedTrackIds={editedTrackIds}
                setTempTracksNum={setTempTracksNum}
                tempTracksNum={tempTracksNum}
                tracks={tracks}
                setTracks={setTracks}
              />
            )}
          </div>
        </div>
        <div
          className={cn(
            "flex w-fit gap-4",
            !miniMenuValue ? "flex-col" : "w-full flex-row border-t  pt-4",
          )}
        >
          <AlbumImage
            miniMenuValue={miniMenuValue}
            albumImage={albumImage}
            setAlbumImage={setAlbumImage}
            title={data.title}
            imageSrc={data.imageSrc}
          />
          <div
            className={cn(
              "flex gap-4",
              !miniMenuValue ? "mb-auto flex-col-reverse" : "flex-col",
            )}
          >
            {data?.genres && (
              <GenresSelect
                disabled={isLoading}
                setData={setData}
                data={data}
              />
            )}
            <div className="flex flex-col gap-4">
              {tracks?.authors?.map((author) => (
                <Author
                  key={author.id}
                  author={author}
                  playlist={null}
                  addContext={false}
                />
              ))}
            </div>
          </div>
        </div>
        <Button
          className="mt-4 w-full"
          onClick={() =>
            playlistData
              ? editHandler(
                  {
                    playlist: playlistData.playlist,
                    tracks: playlistData.tracks?.data,
                  },
                  editedTrackIds.current,
                )
              : submitHandler()
          }
          disabled={submitTransition || isLoading}
        >
          {isLoading
            ? "Loading..."
            : playlistData
              ? "Edit"
              : submitTransition
                ? "Creating..."
                : "Create"}
        </Button>
      </div>
    </div>
  );
}
