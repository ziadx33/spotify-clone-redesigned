import { useSession } from "@/hooks/use-session";
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
  setImage: Dispatch<SetStateAction<File | null>>;
};

export function UploadAboutImage({ image, setImage }: UploadSectionsProps) {
  const { data: user } = useSession();
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const imageDef = image ? URL.createObjectURL(image) : user?.user?.aboutImage;

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("failed uploading the file!");
    setImage(file);
  };

  return (
    <>
      <button
        onClick={() => imageUploadRef.current?.click()}
        type="button"
        className="group relative flex w-[40%] overflow-hidden rounded-lg border bg-card p-4"
      >
        <h1 className="z-20">About The Artist</h1>
        {imageDef ? (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img
            src={imageDef}
            className="absolute left-0 top-0 z-10 size-full"
          />
        ) : (
          <div className="absolute left-0 top-0 grid size-full place-items-center rounded-full">
            <MdOutlineCloudUpload size={50} />
          </div>
        )}
      </button>
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
