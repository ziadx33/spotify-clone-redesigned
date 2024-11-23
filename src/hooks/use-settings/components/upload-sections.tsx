import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import {
  type Dispatch,
  type SetStateAction,
  useRef,
  type ChangeEvent,
} from "react";
import { MdOutlineCloudUpload } from "react-icons/md";
import { toast } from "sonner";

type UploadSectionsProps = {
  image?: File | null;
  coverImage?: File | null;
  setImage: Dispatch<SetStateAction<File | null>>;
  setCoverImage: Dispatch<SetStateAction<File | null>>;
};

export function UploadSections({
  image,
  coverImage,
  setCoverImage,
  setImage,
}: UploadSectionsProps) {
  const { data: user } = useSession();
  const coverImageUploadRef = useRef<HTMLInputElement>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const imageDef = image ? URL.createObjectURL(image) : user?.user?.image;
  const coverImageDef = coverImage
    ? URL.createObjectURL(coverImage)
    : user?.user?.coverImage;
  console.log("taxi", image);

  const onCoverImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("failed uploading the file!");
    setCoverImage(file);
  };

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("failed uploading the file!");
    setImage(file);
  };
  return (
    <>
      <div className="relative  mb-5">
        <button
          type="button"
          onClick={() => coverImageUploadRef.current?.click()}
          className="group relative grid h-52 w-full place-items-center overflow-hidden rounded-lg border bg-card"
        >
          {coverImageDef && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
              <img
                src={coverImageDef}
                className="absolute left-0 top-0 z-10 h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 z-20 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => imageUploadRef.current?.click()}
          className={cn(
            "group absolute -bottom-5 left-1/2 z-30 size-32 -translate-x-1/2 overflow-hidden rounded-full border-4 border-border",
            !image ? "bg-card" : "",
          )}
        >
          {!imageDef ? (
            <div className="relative z-30 grid size-full place-items-center rounded-full">
              <MdOutlineCloudUpload size={50} />
            </div>
          ) : (
            // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
            <img src={imageDef} className="size-full" />
          )}
          <div className="absolute inset-0 z-20 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        </button>
      </div>
      <input
        className="hidden"
        type="file"
        accept="image/*"
        ref={coverImageUploadRef}
        onChange={onCoverImageChange}
      />
      <input
        className="hidden"
        type="file"
        accept="image/*"
        ref={imageUploadRef}
        onChange={onImageChange}
      />
    </>
  );
}
