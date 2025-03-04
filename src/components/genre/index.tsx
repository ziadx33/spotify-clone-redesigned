import { enumParser } from "@/utils/enum-parser";
import { type Playlist, type User, type $Enums } from "@prisma/client";
import { SectionItem } from "../components/section-item";
import { RenderSectionItems } from "../render-section-items";
import { getPopularUsers } from "@/server/queries/user";
import { getPlaylists, getPopularPlaylists } from "@/server/queries/playlist";

export async function Genre({ genre }: { genre: $Enums.GENRES }) {
  const genreTitle = enumParser(genre);
  const { data: playlists } = await getPlaylists({
    range: { to: 31 },
    orderByDate: "asc",
    genre,
    addAuthors: true,
  });
  const newReleases = playlists as { playlists: Playlist[]; authors: User[] };
  const popularPlaylists = await getPopularPlaylists({ type: genre });
  const popularUsers = await getPopularUsers({ genre });
  return (
    <div className="flex flex-col">
      <div className="flex h-72 items-end border-b pb-8 pl-4">
        <h1 className="text-8xl font-black">{genreTitle}</h1>
      </div>
      <div className="flex flex-col pb-3 pl-6">
        <RenderSectionItems
          cards={newReleases.playlists?.map((playlist) => (
            <SectionItem
              playlistData={playlist}
              key={playlist.id}
              description={
                newReleases.authors?.find(
                  (author) => playlist.creatorId === author.id,
                )?.name ?? ""
              }
              title={playlist.title}
              link={`/playlist/${playlist.id}`}
              image={playlist.imageSrc}
              showPlayButton
              type="PLAYLIST"
            />
          ))}
          title="New Releases"
        />
        <RenderSectionItems
          cards={popularPlaylists?.playlists.map((playlist) => (
            <SectionItem
              playlistData={playlist}
              key={playlist.id}
              description={
                popularPlaylists.authors.find(
                  (author) => playlist.creatorId === author.id,
                )?.name ?? ""
              }
              title={playlist.title}
              link={`/playlist/${playlist.id}`}
              image={playlist.imageSrc}
              showPlayButton
              type="PLAYLIST"
            />
          ))}
          title={`Popular ${genreTitle} playlists`}
        />
        <RenderSectionItems
          cards={
            Array.isArray(popularUsers)
              ? popularUsers?.map((user) => (
                  <SectionItem
                    artistData={user}
                    key={user.id}
                    description={"artist"}
                    title={user.name}
                    link={`/artist/${user.id}?playlist=search`}
                    image={user.image ?? ""}
                    type="ARTIST"
                    imageClasses="rounded-full"
                  />
                ))
              : undefined
          }
          title={`Most Streamed ${genreTitle} artists on spotify`}
        />
      </div>
    </div>
  );
}
