import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShowInput } from "@/components/ui/show-input";
import { trackDataSchema } from "@/schemas";
import { type TracksSliceType } from "@/state/slices/tracks";
import { enumParser } from "@/utils/enum-parser";
import { zodResolver } from "@hookform/resolvers/zod";
import { $Enums } from "@prisma/client";
import {
  type MutableRefObject,
  useEffect,
  useState,
  useTransition,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useForm } from "react-hook-form";
import { FaX } from "react-icons/fa6";
import { type z } from "zod";
import { useUserData } from "@/hooks/use-user-data";
import { uploadAudioFile } from "@/server/actions/uploadthing";
import { BestOfTrack } from "./best-of-track";
import { getAudioDuration } from "@/utils/get-audio-duration";

type TrackFormProps = {
  tracks: TracksSliceType["data"];
  setTracks: Dispatch<SetStateAction<TracksSliceType["data"]>>;
  setTempTracksNum: Dispatch<SetStateAction<{ id: string; edit: boolean }[]>>;
  item: { id: string; edit: boolean };
  editedTrackIds: MutableRefObject<string[]>;
};

export function TrackForm({
  setTempTracksNum,
  item,
  setTracks,
  tracks,
  editedTrackIds,
}: TrackFormProps) {
  const user = useUserData();
  const editData = item.edit
    ? tracks?.tracks?.find((track) => track.id === item.id)
    : undefined;
  const form = useForm<z.infer<typeof trackDataSchema>>({
    resolver: zodResolver(trackDataSchema),
    defaultValues: {
      title: editData?.title,
    },
  });
  const closeHandler = () => {
    setTempTracksNum((prev) => prev.filter((itm) => itm.id !== item.id));
  };
  const [transition, startTransition] = useTransition();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioFileTransition, setAudioFileTransition] = useTransition();
  const [startMarker, setStartMarker] = useState(0);
  const [endMarker, setEndMarker] = useState(0);
  useEffect(() => {
    if (!editData) return;
    setAudioFileTransition(async () => {
      if (!editData) return;
      const response = await fetch(editData.trackSrc);
      if (!response.ok) {
        throw new Error("Failed to fetch audio file");
      }
      const blob = await response.blob();
      const file = new File([blob], editData.title, {
        type: blob.type,
      });
      setAudioFile(file);
    });
  }, [editData]);
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
                authorIds: [],
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
              },
            ],
            albums: [],
            authors: [user],
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
                      bestTimeStart: startMarker,
                      bestTimeEnd: endMarker,
                    }
                  : track,
              ) ?? null,
            authors: v?.authors ?? [],
            albums: v?.albums ?? [],
          }));
        }

        setTempTracksNum((prev) => prev.filter((itm) => itm.id !== item.id));
      });
    } catch (error) {
      console.error("Error calculating audio duration:", error);
    }
  };

  const genres = Object.keys($Enums.GENRES);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pt-2">
        <CardTitle>Track Form</CardTitle>
        <Button
          variant="ghost"
          className="border"
          size="icon"
          onClick={closeHandler}
        >
          <FaX />
        </Button>
      </CardHeader>
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
    </Card>
  );
}
