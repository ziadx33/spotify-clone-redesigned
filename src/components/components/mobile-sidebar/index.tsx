import { useUserData } from "@/hooks/use-user-data";
import Link from "next/link";
import { CiUser } from "react-icons/ci";
import { HiSparkles } from "react-icons/hi2";
import { SlMagnifier } from "react-icons/sl";
import { TbBooks } from "react-icons/tb";
import { TiHome } from "react-icons/ti";

export function MobileSidebar() {
  const user = useUserData();
  return (
    <div className="flex justify-between border-t px-8 py-3">
      <Link
        href="/"
        className="flex flex-col items-center gap-2 text-muted-foreground"
      >
        <TiHome size={30} />
        <span className="text-xs">Home</span>
      </Link>
      <Link
        href="/explore"
        className="flex flex-col items-center gap-2 text-muted-foreground"
      >
        <HiSparkles size={30} />
        <span className="text-xs">Discover</span>
      </Link>
      <Link
        href="/search"
        className="flex flex-col items-center gap-2 text-muted-foreground"
      >
        <SlMagnifier size={30} />
        <span className="text-xs">Search</span>
      </Link>
      <Link
        href="/library"
        className="flex flex-col items-center gap-2 text-muted-foreground"
      >
        <TbBooks size={30} />
        <span className="text-xs">Library</span>
      </Link>
      <Link
        href={`/artist/${user.id}`}
        className="flex flex-col items-center gap-2 text-muted-foreground"
      >
        <CiUser size={30} />
        <span className="text-xs">Me</span>
      </Link>
    </div>
  );
}
