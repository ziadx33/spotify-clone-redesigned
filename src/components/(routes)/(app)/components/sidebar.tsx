import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TiHome } from "react-icons/ti";
import { SlMagnifier } from "react-icons/sl";
import { AlbumsSection } from "./playlists-section";

export function Sidebar() {
  return (
    <aside className="h-full w-[20%] border-r p-2">
      <div className="mb-4 flex flex-col gap-2">
        <Button
          variant="ghost"
          className="flex h-14 w-full items-center justify-start pl-4 text-xl"
          asChild
        >
          <Link href="/home">
            <TiHome size={35} className="mb-1 mr-2" />
            Home
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="flex h-14 w-full items-center justify-start pl-4 text-xl"
          asChild
        >
          <Link href="/search">
            <SlMagnifier size={25} className="mr-[1.150rem]" />
            Search
          </Link>
        </Button>
      </div>
      <AlbumsSection />
    </aside>
  );
}
