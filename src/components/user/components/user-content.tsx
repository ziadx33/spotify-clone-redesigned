"use client";

import { cn } from "@/lib/utils";
import { type Playlist, type User } from "@prisma/client";
import Image from "next/image";
import { TopArtists } from "./top-artists";
import { type TracksSliceType } from "@/state/slices/tracks";
import { TopTracks } from "./top-tracks";
import { EditProfile } from "./edit-profile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSession } from "@/hooks/use-session";
import { PublicPlaylists } from "./public-playlists";
import { UsersSection } from "./users-section";
import { useQuery } from "@tanstack/react-query";
import { getPrefrence } from "@/server/actions/prefrence";
import { RenderSectionItems } from "@/components/render-section-items";
import { EditDropdown } from "./edit-dropdown";

type UserContentProps = {
  user?: User;
  publicPlaylists: Playlist[];
  followedArtists: User[];
  followerUsers: User[];
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
  followerUsers,
}: UserContentProps) {
  const { data: curUser } = useSession();
  const userData = user?.id === curUser?.user?.id ? curUser?.user : user;
  const image = userData?.image;
  const isCurUser = curUser?.user?.id === user?.id;
  const { data: userPrefrence } = useQuery({
    queryKey: [`profile-prefrence-${user?.id}`],
    queryFn: async () => {
      const prefrence = await getPrefrence(user!.id);
      return prefrence;
    },
    enabled: !isCurUser && !!user?.id,
  });
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
          {userData?.type === "USER" && <EditDropdown userData={userData} />}
          {!isCurUser && !userPrefrence ? (
            <RenderSectionItems
              cards={[]}
              title="Top artists this month"
              cardsContainerClasses="gap-2"
              isLoading={true}
            />
          ) : (
              !isCurUser ? userPrefrence?.data?.ShowTopPlayingArtists : true
            ) ? (
            <TopArtists artists={topArtists} user={userData} />
          ) : null}

          {!isCurUser && !userPrefrence ? (
            <RenderSectionItems
              cards={[]}
              title="Top artists this month"
              cardsContainerClasses="gap-2"
              isLoading={true}
            />
          ) : (
              !isCurUser ? userPrefrence?.data?.ShowTopPlayingTracks : true
            ) ? (
            <TopTracks user={userData} data={topTracks} />
          ) : null}

          {!isCurUser && !userPrefrence ? (
            <RenderSectionItems
              cards={[]}
              title="Top artists this month"
              cardsContainerClasses="gap-2"
              isLoading={true}
            />
          ) : (
              !isCurUser ? userPrefrence?.data?.ShowPlaylistsInProfile : true
            ) ? (
            <PublicPlaylists playlists={publicPlaylists} user={userData} />
          ) : null}
          {!isCurUser && !userPrefrence ? (
            <RenderSectionItems
              cards={[]}
              title="Top artists this month"
              cardsContainerClasses="gap-2"
              isLoading={true}
            />
          ) : (!isCurUser ? userPrefrence?.data?.ShowFollowingList : true) ? (
            <UsersSection
              users={followedArtists}
              user={userData}
              title="Following"
            />
          ) : null}

          {!isCurUser && !userPrefrence ? (
            <RenderSectionItems
              cards={[]}
              title="Top artists this month"
              cardsContainerClasses="gap-2"
              isLoading={true}
            />
          ) : (!isCurUser ? userPrefrence?.data?.ShowFollowersList : true) ? (
            <UsersSection
              users={followerUsers}
              user={userData}
              title="Followers"
            />
          ) : null}
        </div>
      </div>
      <DialogContent className="flex h-[26rem] w-[45rem] flex-col">
        <EditProfile user={userData} />
      </DialogContent>
    </Dialog>
  );
}
