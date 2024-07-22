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
import { handleRequests } from "@/utils/handle-requests";
import { FansLikeSection } from "./components/fans-like-section";
import { getArtistFansFollowing } from "@/server/actions/user";
import { DiscoveredOnSection } from "./components/discovered-on-section";

type ArtistProps = {
  artist: User;
  playlistId: string;
};

export async function Artist({ artist, playlistId }: ArtistProps) {
  const requests = [
    getPopularTracks({
      artistId: artist.id,
      range: { from: 0, to: 10 },
    }),
    getSavedTracks({
      artistId: artist.id,
    }),
    getPlaylists({
      creatorId: artist.id,
      playlistIds: [],
    }),
    getFeaturingAlbums({
      artistId: artist.id,
    }),
    getArtistFansFollowing({
      followers: artist.followers,
      artistId: artist.id,
    }),
    getAppearsPlaylists({ creatorId: artist.id }),
    getPlaylists({ playlistIds: artist.discoveredOn }),
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
        <Controls playlistId={playlistId} artist={artist} />
        <div className="flex gap-8">
          <PopularTracks data={data[0]} />
          <SavedTracks artist={artist} data={data[1]} />
        </div>
        <DiscographySection
          playlistId={playlistId}
          artist={artist}
          data={data[2]}
        />
        <FeaturingSection artist={artist} data={data[3]} />
        <FansLikeSection artist={artist} data={data[4]} />
        <AppearsOnSection artist={artist} data={data[5]} />
        <DiscoveredOnSection artist={artist} data={data[6].data ?? []} />
        <AboutSection artist={artist} />
      </div>
    </div>
  );
}
