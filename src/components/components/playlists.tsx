"use client";

import { usePlaylists } from "@/hooks/use-playlists";
import { useSession } from "@/hooks/use-session";
import { LibraryItem } from "./library-item";
import { useFollowing } from "@/hooks/use-following";
import { LibraryItemSkeleton } from "../artist/components/skeleton";

export function Playlists() {
  const { status, data: playlists, error } = usePlaylists();
  const { status: stat, data: following, error: err } = useFollowing();
  const { data } = useSession();
  if ([error, err].includes("error")) return <h1>{error}</h1>;
  return (
    <div className="flex flex-col gap-1">
      {![status, stat].includes("loading") ? (
        <>
          {playlists?.map((playlist) => (
            <LibraryItem
              key={playlist.id}
              type="PLAYLIST"
              userData={data?.user}
              data={playlist}
            />
          ))}
          {following?.map((user) => {
            return (
              <LibraryItem
                key={user.id}
                type="ARTIST"
                userData={data?.user}
                data={user}
                imageClassNames="rounded-full"
              />
            );
          })}
        </>
      ) : (
        <LibraryItemSkeleton amount={5} />
      )}
    </div>
  );
}
