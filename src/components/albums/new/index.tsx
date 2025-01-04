"use client";

import { useMiniMenu } from "@/hooks/use-mini-menu";
import { useUserData } from "@/hooks/use-user-data";
import { cn } from "@/lib/utils";
import { type Track, type Playlist } from "@prisma/client";
import { useState, useTransition } from "react";
import { Author } from "@/components/[playlistId]/album/components/author";
import { type TracksSliceType } from "@/state/slices/tracks";
import { MusicPlayer } from "@/components/[playlistId]/components/music-player";
import { GenresSelect } from "./components/genres-select";
import { AlbumImage } from "./components/album-image";
import { AlbumTitle } from "./components/album-title";
import { TracksData } from "./components/tracks-data";
import { CreateTrackContainer } from "./components/create-track-container";
import { NonSortTable } from "@/components/components/non-sort-table";
import { Table } from "@/components/ui/table";
import { deleteAudioFile } from "@/server/actions/uploadthing";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createPlaylist } from "@/server/actions/playlist";
import { createTracks } from "@/server/actions/track";
import { useRouter } from "next/navigation";
import { uploadPlaylistPic } from "@/server/actions/upload";
import { SUPABASE_BUCKET_URL } from "@/constants";

export function NewAlbum() {
  const { value: miniMenuValue } = useMiniMenu();
  const creatorData = useUserData();
  const router = useRouter();
  const [data, setData] = useState<Omit<Playlist, "id">>({
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
  const [tempTracksNum, setTempTracksNum] = useState<string[]>([
    crypto.randomUUID(),
  ]);
  const [albumImage, setAlbumImage] = useState<File | null>(null);
  const deleteTrackHandler = (track: Track) => {
    void deleteAudioFile(track.id);
    setTracks((prev) => {
      if (!prev?.tracks) return prev;
      return {
        ...prev,
        tracks: prev.tracks.filter((t) => t.id !== track.id),
      };
    });
  };
  const [submitTransition, startSubmitTransition] = useTransition();
  const submitHandler = () => {
    startSubmitTransition(async () => {
      console.log("deep", data);
      if (tracks?.tracks?.length === 0) {
        toast.error("Add at least one track");
        return;
      }
      if (!data.genres?.length) {
        toast.error("Add at least one genre");
        return;
      }
      const playlistId = crypto.randomUUID();
      let playlist;
      if (albumImage) {
        const playlistPicData = await uploadPlaylistPic({
          file: albumImage,
          id: playlistId,
        });
        playlist = await createPlaylist({
          ...data,
          imageSrc: `${SUPABASE_BUCKET_URL}/images/${playlistPicData}?${performance.now()}`,
        });
      } else playlist = await createPlaylist(data);
      if (tracks?.tracks) {
        await createTracks(
          tracks.tracks.map((track) => ({
            ...track,
            albumId: playlist.id,
            imgSrc: playlist.imageSrc,
          })),
        );
      }
      router.push(`/playlist/${playlist.id}`);
    });
  };
  return (
    <div>
      <div
        className={cn(
          "flex justify-between gap-x-4 p-8 pb-6",
          miniMenuValue ? "flex-col" : "",
        )}
      >
        <div className="flex w-[95%] flex-col">
          <AlbumTitle data={data} setData={setData} />
          <div className="flex gap-1.5">
            <TracksData data={data} tracks={tracks} />
          </div>
          <div className="flex size-full flex-col gap-4 pb-4">
            <MusicPlayer disabled newAlbum showExploreButton={false} />
            <Table>
              <NonSortTable
                viewAs="LIST"
                data={tracks}
                showNoTracksMessage={false}
                showTrackImage={false}
                hideTrackContext
                replaceDurationWithButton={{
                  name: "remove",
                  fn: deleteTrackHandler,
                }}
              />
            </Table>
            <CreateTrackContainer
              setTempTracksNum={setTempTracksNum}
              tempTracksNum={tempTracksNum}
              tracks={tracks}
              setTracks={setTracks}
            />
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
            {data?.genres && <GenresSelect setData={setData} data={data} />}
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
          onClick={submitHandler}
          disabled={submitTransition}
        >
          {submitTransition ? "Creating..." : "Create"}
        </Button>
      </div>
    </div>
  );
}
