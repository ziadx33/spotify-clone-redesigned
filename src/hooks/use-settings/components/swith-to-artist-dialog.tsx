"use client";

import {
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ShowInput } from "@/components/ui/show-input";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { UploadSections } from "./upload-sections";
import { Button } from "@/components/ui/button";
import { UploadAboutImage } from "./upload-about-image";
import { useUpdateUser } from "@/hooks/use-update-user";
import { type User } from "@prisma/client";
import { uploadPlaylistPic } from "@/server/actions/upload";
import { SUPABASE_BUCKET_URL } from "@/constants";
import { useUserData } from "@/hooks/use-user-data";

const formSchema = z.object({
  name: z.string().min(3).max(20),
  about: z.string().min(0),
});

export function SwitchToArtistDialog() {
  const user = useUserData();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name ?? "",
      about: user?.about ?? "",
    },
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [aboutImage, setAboutImage] = useState<File | null>(null);
  const { update: updateUser } = useUpdateUser();
  const closeDialogRef = useRef<HTMLButtonElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formHandler = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const uploadData: Partial<User> = {
      ...data,
      type: "ARTIST",
    };
    if (image) {
      const path = await uploadPlaylistPic({
        id: user?.id ?? "",
        file: image,
      });
      uploadData.image = `${SUPABASE_BUCKET_URL}/images/${path}?${performance.now()}`;
    }
    if (coverImage) {
      const path = await uploadPlaylistPic({
        id: `${user?.id}-cover-image` ?? "",
        file: coverImage,
      });
      uploadData.coverImage = `${SUPABASE_BUCKET_URL}/images/${path}?${performance.now()}`;
    }
    if (aboutImage) {
      const path = await uploadPlaylistPic({
        id: `${user?.id}-about-image` ?? "",
        file: aboutImage,
      });
      uploadData.aboutImage = `${SUPABASE_BUCKET_URL}/images/${path}?${performance.now()}`;
    }

    await updateUser({
      data: uploadData,
    });

    setCoverImage(null);
    setImage(null);
    setAboutImage(null);
    closeDialogRef.current?.click();
    setIsLoading(false);
  };

  return (
    <DialogContent className="max-w-[50rem]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(formHandler)}>
          <div className="mt-4 w-full space-y-4">
            <UploadSections
              coverImage={coverImage}
              image={image}
              setImage={setImage}
              setCoverImage={setCoverImage}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <ShowInput id="name" placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem className="w-[60%]">
                    <FormLabel htmlFor="about">About</FormLabel>
                    <FormControl>
                      <Textarea
                        id="about"
                        className="min-h-64"
                        placeholder="about"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <UploadAboutImage setImage={setAboutImage} image={aboutImage} />
            </div>
          </div>
          <DialogFooter className="mt-2.5">
            <Button disabled={isLoading} type="submit" className="w-full">
              Switch
            </Button>
          </DialogFooter>
        </form>
      </Form>
      <DialogClose ref={closeDialogRef} />
    </DialogContent>
  );
}
