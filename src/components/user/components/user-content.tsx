"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { type Playlist, type User } from "@prisma/client";
import Image from "next/image";
import { BsCopy, BsPen, BsThreeDots } from "react-icons/bs";
import { TopArtists } from "./top-artists";
import { type TracksSliceType } from "@/state/slices/tracks";
import { TopTracks } from "./top-tracks";
import { EditProfile } from "./edit-profile";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useSession } from "@/hooks/use-session";
import { PublicPlaylists } from "./public-playlists";
import { FollowedArtists } from "./followed-artists";

type UserContentProps = {
  user?: User;
  publicPlaylists: Playlist[];
  followedArtists: User[];
  isUser: boolean;
  topArtists: User[];
  topTracks: TracksSliceType["data"];
};

export function UserContent({
  user,
  publicPlaylists,
  followedArtists,
  isUser,
  topTracks,
  topArtists,
}: UserContentProps) {
  const { data: curUser } = useSession();
  const userData = user?.id === curUser?.user?.id ? curUser?.user : user;
  const image = userData?.image;
  return (
    <Dialog>
      <div className="flex min-h-full w-full flex-col">
        <div
          style={{
            background: `url(${userData?.coverImage}) no-repeat`,
            backgroundSize: "cover",
            backgroundPosition: "top center",
          }}
          className={cn(
            "flex  w-full  border-b p-8",
            userData?.coverImage
              ? "h-[30rem] items-end"
              : "h-96 place-items-end",
          )}
        >
          <div className="flex items-center  gap-6">
            {!userData?.coverImage && (
              <Image
                src={image ?? ""}
                width={200}
                height={200}
                alt={userData?.name ?? ""}
                className="size-[200px] rounded-full"
              />
            )}
            <div className="flex flex-col">
              <p>profile</p>
              <b className="mb-4 mt-2 text-8xl">{userData?.name}</b>
              <p>
                {publicPlaylists?.length} Public Playlists
                {isUser && ` - ${followedArtists?.length} Following`}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-12 p-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-fit">
                <BsThreeDots size={30} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <BsPen className="mr-2" />
                  Edit Profile
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.origin}/artist/${userData?.id}`,
                  )
                }
              >
                <BsCopy className="mr-2" />
                Copy link to profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <TopArtists artists={topArtists} user={userData} />
          <TopTracks user={userData} data={topTracks} />
          <PublicPlaylists playlists={publicPlaylists} user={userData} />
          <FollowedArtists artists={followedArtists} user={userData} />
        </div>
      </div>
      <DialogContent className="flex h-[26rem] w-[45rem] flex-col">
        <EditProfile user={userData} />
      </DialogContent>
    </Dialog>
  );
}

// TODO: make profile page loading
