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

type TrackFormProps = {
  tracks: TracksSliceType["data"];
  setTracks: Dispatch<SetStateAction<TracksSliceType["data"]>>;
  setTempTracksNum: Dispatch<SetStateAction<string[]>>;
  item: string;
};

export function TrackForm({
  setTempTracksNum,
  item,
  setTracks,
}: TrackFormProps) {
  const user = useUserData();
  const form = useForm<z.infer<typeof trackDataSchema>>({
    resolver: zodResolver(trackDataSchema),
    defaultValues: {
      title: "",
    },
  });

  const closeHandler = () => {
    setTempTracksNum((prev) => prev.filter((itm) => itm !== item));
  };
  const [transition, startTransition] = useTransition();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const formHandler = (data: z.infer<typeof trackDataSchema>) => {
    if (!audioFile) return;

    const audio = new Audio(URL.createObjectURL(audioFile));

    audio.onloadedmetadata = async () => {
      const durationInSeconds = Math.floor(audio.duration);

      startTransition(async () => {
        const id = crypto.randomUUID();
        const uploadedAudioData = await uploadAudioFile(audioFile, id);

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
              trackSrc: uploadedAudioData?.url ?? "",
              albumId: "",
              playlists: [],
              dateAdded: new Date(),
              duration: durationInSeconds,
              plays: 0,
              genres: [data.genre],
              bestTimeStart: null,
              bestTimeEnd: null,
              likedUsers: [],
            },
          ],
          albums: [],
          authors: [user],
        }));

        setTempTracksNum((prev) => prev.filter((itm) => itm !== item));
      });
    };
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
                          <SelectValue placeholder="Select Genre" />
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
            <FileUpload file={audioFile} setFile={setAudioFile} />
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
