import { cn } from "@/lib/utils";
import Image from "next/image";
import { memo, useRef, type Dispatch, type SetStateAction } from "react";

type AlbumImageProps = {
  miniMenuValue: boolean;
  albumImage: File | null;
  setAlbumImage: Dispatch<SetStateAction<File | null>>;
  title: string;
  imageSrc: string;
};

export function Comp({
  miniMenuValue,
  albumImage,
  setAlbumImage,
  title,
  imageSrc,
}: AlbumImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAlbumImage(e.target.files[0]);
    }
  };
  return (
    <>
      <button
        className={cn(
          "group relative w-full max-lg:h-[350px] max-lg:w-full",
          !miniMenuValue ? "h-[500px] lg:w-[500px]" : "h-[300px] lg:w-[300px]",
        )}
        onClick={() => inputRef.current?.click()}
      >
        <Image
          src={!albumImage ? imageSrc : URL.createObjectURL(albumImage)}
          fill
          draggable="false"
          alt={title ?? ""}
          className="rounded-md"
        />
        <div className="absolute inset-0 z-20 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      </button>
      <input
        ref={inputRef}
        className="hidden"
        onChange={onChange}
        accept="image/*"
        type="file"
      />
    </>
  );
}

export const AlbumImage = memo(Comp);
