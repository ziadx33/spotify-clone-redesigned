import { Button } from "@/components/ui/button";
import { DialogClose, DialogHeader } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SUPABASE_BUCKET_URL } from "@/constants";
import { type Session } from "@/hooks/use-session";
import { useUpdateUser } from "@/hooks/use-update-user";
import { uploadPlaylistPic } from "@/server/actions/upload";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { type ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaPen } from "react-icons/fa";
import { toast } from "sonner";
import { z } from "zod";

const editProfileSchema = z.object({
  name: z.string().min(3),
});

export function EditProfile({ user }: { user: Session["user"] }) {
  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name ?? "",
    },
  });

  const closeDialogRef = useRef<HTMLButtonElement>(null);

  const [uploadedImage, setUploadedImage] = useState<File | null>();
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [disabled, setDisabled] = useState(false);
  const { update: updateUser } = useUpdateUser();

  const uploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("please choose an image.");
    setUploadedImage(file);
  };

  const closeDialog = () => closeDialogRef.current?.click();

  const formHandler = async (data: z.infer<typeof editProfileSchema>) => {
    setDisabled(true);
    if (data.name === user?.name && !uploadedImage) return closeDialog();
    const uploadData: typeof data & { image?: string } = data;
    if (uploadedImage) {
      const path = await uploadPlaylistPic({
        id: user?.id ?? "",
        file: uploadedImage,
        currentImageURL: user?.image ?? "",
      });
      uploadData.image = `${SUPABASE_BUCKET_URL}/images/${path}?${performance.now()}`;
    }
    await updateUser({
      data: uploadData,
    });
    closeDialog();
  };

  return (
    <div className="flex size-full flex-col gap-2">
      <DialogHeader className="h-fit">
        <b className="text-3xl">Profile Details</b>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(formHandler)} className="size-full">
          <div className="flex size-full gap-4 [&>*]:h-full [&>*]:w-1/2">
            <button
              onClick={() => uploadInputRef.current?.click()}
              className="group relative"
              type="button"
            >
              {!uploadedImage ? (
                <Image
                  src={user?.image ?? ""}
                  fill
                  alt={user?.name ?? ""}
                  className="size-full rounded-md object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={URL.createObjectURL(uploadedImage)}
                  alt={user?.name ?? ""}
                  className="size-full rounded-md object-cover"
                />
              )}
              <div className="absolute left-0 top-0 hidden size-full flex-col items-center justify-center gap-4 bg-black bg-opacity-30 group-hover:flex">
                <FaPen size={50} />
                <p className="text-lg">choose photo</p>
              </div>
            </button>
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <FormControl>
                      <Input id="name" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={disabled}>
                save
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <input
        onChange={uploadHandler}
        className="hidden"
        type="file"
        ref={uploadInputRef}
      />
      <DialogClose ref={closeDialogRef} />
    </div>
  );
}
