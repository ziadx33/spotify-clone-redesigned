import { accordionTriggerClasses } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoMdHeart } from "react-icons/io";

export function SidebarLikedSongsButton() {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/liked-songs");
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        accordionTriggerClasses,
        "h-12 w-full  px-2 hover:bg-secondary",
      )}
      asChild
    >
      <Link href="/liked-songs">
        <div className="flex items-center gap-2 text-xl">
          <IoMdHeart size={23} />
          Liked songs
        </div>
      </Link>
    </Button>
  );
}
