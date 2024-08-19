import {
  getNewPlaylists,
  getPopularPlaylists,
} from "@/server/actions/playlist";
import { enumParser } from "@/utils/enum-parser";
import { type $Enums } from "@prisma/client";
import { SectionItem } from "../components/section-item";
import { SectionItems } from "./components/section-items";
import { getPopularUsers } from "@/server/actions/user";

export async function Genre({ genre }: { genre: $Enums.GENRES }) {
  const genreTitle = enumParser(genre);
  const newReleases = await getNewPlaylists({ type: genre });
  const popularPlaylists = await getPopularPlaylists({ type: genre });
  const popularUsers = await getPopularUsers({ type: genre });
  console.log("popoular shitterss", popularUsers);
  return (
    <div className="flex flex-col">
      <div className="flex h-72 items-end border-b pb-8 pl-4">
        <h1 className="text-8xl font-black">{genreTitle}</h1>
      </div>
      <div className="flex flex-col pb-3 pl-6">
        <SectionItems
          cards={newReleases?.playlists.map((playlist) => (
            <SectionItem
              key={playlist.id}
              description={
                newReleases.authors.find(
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
        <SectionItems
          cards={popularPlaylists?.playlists.map((playlist) => (
            <SectionItem
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
        <SectionItems
          cards={
            Array.isArray(popularUsers)
              ? popularUsers?.map((user) => (
                  <SectionItem
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
