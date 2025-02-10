import { Author } from "@/components/[playlistId]/album/components/author";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounceState } from "@/hooks/use-debounce-state";
import { useInitRender } from "@/hooks/use-init-render";
import { useUserData } from "@/hooks/use-user-data";
import { getUsersBySearchQuery } from "@/server/actions/user";
import { type Playlist, type User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { FaPlus } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

type TrackFormArtistsProps = {
  artists: User[];
  setArtists: Dispatch<SetStateAction<User[]>>;
  playlist: Playlist;
};

export function TrackFormArtists({
  playlist,
  setArtists,
  artists,
}: TrackFormArtistsProps) {
  const [searchValue, setSearchValue, debounceSearchValue] =
    useDebounceState("");
  const user = useUserData();
  const [searchArtists, setSearchArtists] = useState<User[]>([]);
  const artistIds = artists.map((artist) => artist.id);
  const { refetch, data } = useQuery({
    queryKey: [],
    queryFn: async () => {
      if (searchValue === "") return [];
      const data = await getUsersBySearchQuery({
        query: searchValue,
        amount: 10,
        type: "ARTIST",
      });
      return data;
    },
    staleTime: 0,
  });
  const initRender = useInitRender();
  useEffect(() => {
    if (initRender) return;
    void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceSearchValue]);
  useEffect(() => {
    if (!data) return;
    setSearchArtists(data);
  }, [data]);
  return (
    <div className="mt-4">
      <div className="mb-2 flex flex-col gap-4">
        {artists.map((artist) => (
          <div key={artist.id} className="flex justify-between">
            <Author author={artist} addContext playlist={playlist} />
            {artist.id !== user.id && (
              <Button
                onClick={() =>
                  setArtists((v) => v.filter((artst) => artst.id !== artist.id))
                }
                variant="outline"
                size="icon"
              >
                <FaX />
              </Button>
            )}
          </div>
        ))}
      </div>
      <Input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="search for artists..."
      />
      <div>
        <div className="mt-4 flex flex-col gap-4">
          {searchArtists.length > 0 ? (
            searchArtists
              .filter(
                (artist) =>
                  !artistIds.includes(artist.id) && artist.id !== user.id,
              )
              .map((artist) => (
                <div key={artist.id} className="flex justify-between">
                  <Author author={artist} addContext playlist={playlist} />
                  <Button
                    onClick={() => setArtists((v) => [...v, artist])}
                    variant="outline"
                    size="icon"
                  >
                    <FaPlus />
                  </Button>
                </div>
              ))
          ) : (
            <h3 className="mx-auto text-muted-foreground">no artists found</h3>
          )}
        </div>
      </div>
    </div>
  );
}
