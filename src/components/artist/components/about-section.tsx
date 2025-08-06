import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type User } from "@prisma/client";
import Image from "next/image";

export function AboutSection({ artist }: { artist: User }) {
  return (
    <div className="w-full flex-col">
      <h1 className="mb-4 text-3xl font-semibold">About</h1>
      <Dialog>
        <DialogTrigger
          style={{
            background: `url(${artist.aboutImage}) no-repeat`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
          className="flex h-[30rem] w-full max-w-[884.969px] items-end rounded-[8px] p-4 transition-all duration-500 hover:scale-[1.03]"
        >
          <p className="text-md line-clamp-3 w-[72%] text-start">
            {artist.about}
          </p>
        </DialogTrigger>
        <DialogContent className="flex h-[694.391px] w-full max-w-[768px] flex-col overflow-y-scroll">
          <DialogTitle />
          <Image
            src={artist.aboutImage ?? ""}
            width={320}
            height={200}
            alt={artist.name ?? ""}
            className="mx-auto"
          />
          <div className="flex">
            <div className="flex w-[80rem] flex-col">
              <div className="flex flex-col">
                <h2 className="text-3xl font-bold">
                  {new Intl.NumberFormat("en-US").format(
                    artist.followers.length ?? 0,
                  )}
                </h2>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
            </div>
            <p className="text-muted-foreground">{artist.about}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
