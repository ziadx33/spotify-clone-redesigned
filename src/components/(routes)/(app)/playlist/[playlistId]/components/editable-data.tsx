import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Playlist, type User } from "@prisma/client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { type ChangeEvent, memo, useRef, useState } from "react";
import { FaPen } from "react-icons/fa";
import { FaCircle } from "react-icons/fa6";
import { z } from "zod";
import { updatePlaylist } from "@/server/actions/playlist";
import { useDispatch } from "react-redux";
import { editPlaylist } from "@/state/slices/playlists";
import { revalidate } from "@/server/actions/revalidate";
import { toast } from "sonner";
import { uploadPlaylistPic } from "@/server/actions/upload";
import { SUPABASE_BUCKET_URL } from "@/constants";

type EditableDataProps = {
  data?: Playlist | null;
  type: string;
  creatorData?: User | null;
  tracksLength?: number | null;
};

const editSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
});

function EditableDataComp({
  data,
  type,
  creatorData,
  tracksLength,
}: EditableDataProps) {
  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: data?.title,
      description: data?.description,
    },
  });
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeDialog = () => closeButtonRef.current?.click();
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const editImageOverlay = (
    <div className="absolute left-0 top-0 hidden size-full flex-col items-center justify-center gap-4 bg-black bg-opacity-30 group-hover:flex">
      <FaPen size={50} />
      <p className="text-lg">choose photo</p>
    </div>
  );

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("please choose an image.");
    setUploadedImage(file);
  };

  const formHandler = async (formData: z.infer<typeof editSchema>) => {
    setDisabled(true);
    const uploadData: typeof formData & { imageSrc?: string } = formData;
    if (uploadedImage) {
      const path = await uploadPlaylistPic({
        id: data?.id ?? "",
        file: uploadedImage,
        currentImageURL: data?.imageSrc ?? "",
      });
      uploadData.imageSrc = `${SUPABASE_BUCKET_URL}/images/${path}?${performance.now()}`;
    }
    await updatePlaylist({ id: data?.id ?? "", data: uploadData });
    dispatch(editPlaylist({ id: data?.id ?? "", data: formData }));
    revalidate(`/playlist/${data?.id}`);
    closeDialog();
    setDisabled(false);
  };
  return (
    <Dialog>
      <div className="flex h-fit w-full gap-8 p-8 pb-6">
        <DialogTrigger className="group relative h-[288px] w-[288px]">
          <Image
            src={data?.imageSrc ?? ""}
            fill
            draggable="false"
            alt={data?.title ?? ""}
            className="rounded-md object-cover"
          />
          {editImageOverlay}
        </DialogTrigger>
        <div className="flex flex-col pt-[6.2rem]">
          <h3 className="mb-4">{type}</h3>
          <DialogTrigger
            title={data?.title}
            className="mb-5 line-clamp-1 text-8xl font-bold"
          >
            {data?.title}
          </DialogTrigger>
          <div>
            {creatorData?.image && (
              <Image
                width={20}
                height={20}
                draggable="false"
                alt={creatorData?.name ?? ""}
                src={creatorData?.image ?? ""}
              />
            )}
            <span className="flex items-center gap-1.5">
              {creatorData?.name}
              <FaCircle size="5" /> {tracksLength} tracks
            </span>
          </div>
        </div>
      </div>
      <DialogContent className="flex h-[26rem] w-[53rem] flex-col items-start">
        <DialogHeader>
          <DialogTitle>Edit details</DialogTitle>
        </DialogHeader>
        <div className="flex size-full gap-3">
          <button
            onClick={() => uploadInputRef.current?.click()}
            className="group relative basis-[40%]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                uploadedImage
                  ? URL.createObjectURL(uploadedImage)
                  : data?.imageSrc ?? ""
              }
              draggable="false"
              alt={data?.title ?? ""}
              className="h-[20rem] w-full rounded-md object-cover"
            />
            {editImageOverlay}
          </button>
          <input
            type="file"
            ref={uploadInputRef}
            onChange={changeImageHandler}
            className="hidden"
            accept="image/png, image/jpeg"
          />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(formHandler)}
              className="flex basis-[60%] flex-col [&>*]:w-full"
            >
              <>
                <CardContent className="pb-2">
                  <div className="w-full space-y-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="password">Title</FormLabel>
                          <FormControl>
                            <Input id="title" type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="description">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              id="description"
                              defaultValue={data?.description}
                              className="min-h-36 resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="mt-auto py-0">
                  <Button disabled={disabled} type="submit" className="w-full">
                    Save
                  </Button>
                </CardFooter>
              </>
            </form>
          </Form>
        </div>
      </DialogContent>
      <DialogClose ref={closeButtonRef} />
    </Dialog>
  );
}

export const EditableData = memo(EditableDataComp);
