import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ShowInput } from "@/components/ui/show-input";
import { type trackDataSchema } from "@/schemas";
import { enumParser } from "@/utils/enum-parser";
import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";
import { BestOfTrack } from "./best-of-track";
import { uploadAudioFile } from "@/server/actions/uploadthing";
import { getAudioDuration } from "@/utils/get-audio-duration";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { $Enums, type User, type Track, type Playlist } from "@prisma/client";
import {
  type Dispatch,
  type SetStateAction,
  useState,
  useTransition,
  type MutableRefObject,
} from "react";
import { type TracksSliceType } from "@/state/slices/tracks";
import { useUserData } from "@/hooks/use-user-data";
import { TrackFormArtists } from "./track-form-artists";

type TrackDataSchemaData = z.infer<typeof trackDataSchema>;

type TrackFormCompFormProps = {
  form: UseFormReturn<TrackDataSchemaData>;
  tracks: TracksSliceType["data"];
  setTracks: Dispatch<SetStateAction<TracksSliceType["data"]>>;
  editedTrackIds: MutableRefObject<string[]>;
  audioFileTransition: boolean;
  audioFile: File | null;
  setAudioFile: Dispatch<SetStateAction<File | null>>;
  editData: Track | undefined;
  item: { id: string; edit: boolean };
  setTempTracksNum: Dispatch<SetStateAction<{ id: string; edit: boolean }[]>>;
  playlist: Playlist;
};

export function TrackFormCompForm({
  form,
  tracks,
  setTracks,
  editedTrackIds,
  audioFileTransition,
  audioFile,
  editData,
  setAudioFile,
  item,
  setTempTracksNum,
  playlist,
}: TrackFormCompFormProps) {
  const user = useUserData();
  const genres = Object.keys($Enums.GENRES);
  const [transition, startTransition] = useTransition();
  const [startMarker, setStartMarker] = useState(0);
  const [endMarker, setEndMarker] = useState(0);
  const [artists, setArtists] = useState<User[]>(tracks?.authors ?? [user]);
  const formHandler = async (data: z.infer<typeof trackDataSchema>) => {
    if (!audioFile) return;

    try {
      startTransition(async () => {
        const durationInSeconds = await getAudioDuration(audioFile);
        const id = crypto.randomUUID();
        const uploadedAudioData =
          audioFile.name === editData?.title
            ? audioFile
            : await uploadAudioFile(audioFile, id);
        const trackSrc =
          audioFile.name === editData?.title
            ? editData.trackSrc
            : (uploadedAudioData as { url: string }).url;

        if (!item.edit)
          setTracks((prev) => ({
            tracks: [
              ...(prev?.tracks ?? []),
              {
                id,
                order: prev?.tracks ? prev.tracks.length + 1 : 1,
                title: data.title,
                authorId: user.id,
                authorIds: artists.map((artist) => artist.id),
                imgSrc: "",
                trackSrc,
                albumId: "",
                playlists: [],
                dateAdded: new Date(),
                duration: durationInSeconds,
                plays: 0,
                genres: [data.genre],
                bestTimeStart: startMarker,
                bestTimeEnd: endMarker,
                likedUsers: [],
                createdAt: new Date(),
              },
            ],
            albums: [],
            authors: artists,
          }));
        else {
          editedTrackIds.current = [...editedTrackIds.current, item.id];
          setTracks((v) => ({
            ...v,
            tracks:
              v?.tracks?.map((track) =>
                track.id === item.id
                  ? {
                      ...track,
                      title: data.title,
                      trackSrc: trackSrc,
                      duration: durationInSeconds,
                      genres: [data.genre],
                      authorIds: artists.map((artist) => artist.id),
                      bestTimeStart: startMarker,
                      bestTimeEnd: endMarker,
                    }
                  : track,
              ) ?? null,
            authors: artists,
            albums: v?.albums ?? [],
          }));
        }

        setTempTracksNum((prev) => prev.filter((itm) => itm.id !== item.id));
      });
    } catch (error) {
      console.error("Error calculating audio duration:", error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)}>
        <CardContent className="h-fit">
          <div className="flex w-full flex-col space-y-4 md:flex-row md:space-x-2 md:space-y-0">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <FormControl>
                    <ShowInput id="title" placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel htmlFor="description">Genre</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select Genre"
                          defaultValue={editData?.genres[0]}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map((genre) => (
                          <SelectItem value={genre} key={genre}>
                            {enumParser(genre)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FileUpload
            loading={audioFileTransition}
            title={audioFileTransition ? "Loading..." : "Audio Upload"}
            file={audioFile}
            setFile={setAudioFile}
          />
          {audioFile && (
            <BestOfTrack
              endMarker={endMarker}
              setEndMarker={setEndMarker}
              setStartMarker={setStartMarker}
              startMarker={startMarker}
              file={audioFile}
            />
          )}
          <TrackFormArtists
            artists={artists}
            playlist={playlist}
            setArtists={setArtists}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="submit"
            className="w-full"
            disabled={!audioFile || transition}
          >
            {transition ? "Submitting..." : "Submit"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
