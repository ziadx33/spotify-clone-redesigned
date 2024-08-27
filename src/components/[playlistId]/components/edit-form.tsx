import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { DialogHeader } from "@/components/ui/dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SUPABASE_BUCKET_URL } from "@/constants";
import { updatePlaylist } from "@/server/actions/playlist";
import { revalidate } from "@/server/actions/revalidate";
import { uploadPlaylistPic } from "@/server/actions/upload";
import { editPlaylist } from "@/state/slices/playlists";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Playlist } from "@prisma/client";
import { DialogTitle } from "@radix-ui/react-dialog";
import { type ReactNode, useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";
import Image from "next/image";

type EditFormProps = {
  editImageOverlay: ReactNode;
  data?: Playlist | null;
  closeDialog?: () => void;
};

const editSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
});

export function EditForm({
  editImageOverlay,
  data,
  closeDialog,
}: EditFormProps) {
  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: data?.title,
      description: data?.description,
    },
  });
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
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
    closeDialog?.();
    setUploadedImage(null);
    setDisabled(false);
  };

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("please choose an image.");
    setUploadedImage(file);
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit details</DialogTitle>
      </DialogHeader>
      <div className="relative flex size-full gap-3">
        <button
          onClick={() => uploadInputRef.current?.click()}
          className="group relative basis-[40%]"
        >
          {!uploadedImage ? (
            <Image
              src={data?.imageSrc ?? ""}
              draggable="false"
              fill
              alt={data?.title ?? ""}
              className="h-[20rem] w-full rounded-md"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={URL.createObjectURL(uploadedImage)}
              draggable="false"
              alt={data?.title ?? ""}
              className="h-[20rem] w-full rounded-md"
            />
          )}

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
                        <FormLabel htmlFor="description">Description</FormLabel>
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
    </>
  );
}
