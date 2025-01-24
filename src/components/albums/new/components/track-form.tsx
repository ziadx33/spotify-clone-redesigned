import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { trackDataSchema } from "@/schemas";
import { type TracksSliceType } from "@/state/slices/tracks";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type MutableRefObject,
  useEffect,
  type Dispatch,
  type SetStateAction,
  useTransition,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { FaX } from "react-icons/fa6";
import { type z } from "zod";

import { TrackFormCompForm } from "./track-form-comp-form";
import { getAudioSrcFile } from "@/utils/get-audio-src-file";

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
  const editData = item.edit
    ? tracks?.tracks?.find((track) => track.id === item.id)
    : undefined;
  const form = useForm<z.infer<typeof trackDataSchema>>({
    resolver: zodResolver(trackDataSchema),
    defaultValues: {
      title: editData?.title,
    },
  });
  const [audioFileTransition, setAudioFileTransition] = useTransition();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const closeHandler = () => {
    setTempTracksNum((prev) => prev.filter((itm) => itm.id !== item.id));
  };

  useEffect(() => {
    if (!editData) return;
    setAudioFileTransition(async () => {
      if (!editData) return;
      setAudioFile(await getAudioSrcFile(editData.trackSrc, editData.title));
    });
  }, [editData]);

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
      <TrackFormCompForm
        form={form}
        setTracks={setTracks}
        editedTrackIds={editedTrackIds}
        audioFileTransition={audioFileTransition}
        audioFile={audioFile}
        editData={editData}
        item={item}
        setAudioFile={setAudioFile}
        setTempTracksNum={setTempTracksNum}
      />
    </Card>
  );
}
