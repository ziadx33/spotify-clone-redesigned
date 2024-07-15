import { type User } from "@prisma/client";
import { Controls } from "./components/controls";
import { PopularTracks } from "./components/popular-tracks";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { SavedTracks } from "./components/saved-tracks";
import { DiscographySection } from "./components/discography-section";
import { AppearsOnSection } from "./components/appears-on-section";
import { AboutSection } from "./components/about-section";
import { FeaturingSection } from "./components/featuring-section";
import {
  getAppearsPlaylists,
  getFeaturingAlbums,
  getPlaylists,
} from "@/server/actions/playlist";
import { getPopularTracks, getSavedTracks } from "@/server/actions/track";
import { getServerAuthSession } from "@/server/auth";
import { handleRequests } from "@/utils/handle-requests";

export async function Artist({ artist }: { artist: User }) {
  const user = await getServerAuthSession();
  const requests = [
    getPopularTracks({
      artistId: artist.id,
      range: { from: 0, to: 10 },
    }),
    getSavedTracks({
      artistId: artist.id,
      playlists: user?.user.playlists ?? [],
    }),
    getPlaylists({
      creatorId: artist.id,
      playlistIds: [],
    }),
    getFeaturingAlbums({
      artistId: artist.id,
    }),
    getAppearsPlaylists({ creatorId: artist.id }),
  ] as const;
  const data = await handleRequests(requests);
  return (
    <div className="flex min-h-full w-full flex-col">
      <div
        style={{
          background: `url(${artist.coverImage}) no-repeat`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
        className={cn(
          "flex  w-full  border-b p-8",
          artist.coverImage ? "h-[30rem] items-end" : "h-72 items-center gap-8",
        )}
      >
        {!artist.coverImage && (
          <Image
            src={artist.image ?? ""}
            width={200}
            height={200}
            alt={artist.name ?? ""}
            className="size-[200px] rounded-full object-cover"
          />
        )}
        <b className="text-8xl">{artist.name}</b>
      </div>
      <div className="flex flex-col gap-12 p-8">
        <Controls artist={artist} />
        <div className="flex gap-8">
          <PopularTracks data={data[0]} />
          <SavedTracks artist={artist} data={data[1]} />
        </div>
        <DiscographySection artist={artist} data={data[2]} />
        <FeaturingSection artist={artist} data={data[3]} />
        <AppearsOnSection artist={artist} />
        <AboutSection artist={artist} />
      </div>
    </div>
  );
}
