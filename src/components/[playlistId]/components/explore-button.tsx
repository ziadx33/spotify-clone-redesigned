import { useTracks } from "@/hooks/use-tracks";
import { setExploreData } from "@/state/slices/explore";
import { type AppDispatch } from "@/state/store";
import { type Playlist } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

type ExploreButtonProps = {
  playlist?: Playlist | null;
};

export function ExploreButton({ playlist }: ExploreButtonProps) {
  const {
    data: { data: tracksData },
  } = useTracks();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const exploreButtonHandler = () => {
    if (tracksData)
      dispatch(setExploreData({ data: { ...tracksData, randomly: false } }));
    router.push("/explore");
  };
  return (
    <button
      onClick={exploreButtonHandler}
      className="relative mr-2.5 h-12 w-8 overflow-hidden rounded-md border-[1.5px] border-white"
    >
      <Image src={playlist?.imageSrc ?? ""} fill alt={playlist?.title ?? ""} />
    </button>
  );
}
