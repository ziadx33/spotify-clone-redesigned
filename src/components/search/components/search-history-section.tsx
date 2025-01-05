import { SectionItem } from "@/components/components/section-item";
import { RenderSectionItems } from "@/components/render-section-items";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/hooks/use-user-data";
import { getPlaylists } from "@/server/actions/playlist";
import {
  getSearchHistory,
  removeSearchHistoryById,
} from "@/server/actions/search-history";
import { getUserByIds } from "@/server/actions/user";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { FaX } from "react-icons/fa6";

export function SearchHistorySection() {
  const user = useUserData();
  const [currentRemovedSearchHistoryIds, setCurrentRemovedSearchHistoryIds] =
    useState<string[]>([]);
  const { data, isLoading } = useQuery({
    queryKey: ["search-history"],
    queryFn: async () => {
      const searchHistory = await getSearchHistory(user?.id ?? "");
      const { data: playlists } = await getPlaylists({
        playlistIds: searchHistory
          .filter(
            (history) => history.type === "PLAYLIST" && history.searchPlaylist,
          )
          .map((history) => history.searchPlaylist!),
      });
      const users = await getUserByIds(
        searchHistory
          .filter((history) => history.type === "ARTIST" && history.searchUser)
          .map((history) => history.searchUser!),
      );
      return searchHistory.map((item) => {
        return {
          searchItem: item,
          user: users.find((user) => user.id === item.searchUser),
          playlist: playlists?.find(
            (playlist) => playlist.id === item.searchPlaylist,
          ),
        };
      });
    },
    enabled: !!user?.id,
  });
  const removeFromHistoryHandler = useCallback(
    async (id: string) => {
      setCurrentRemovedSearchHistoryIds((v) => [...v, id]);
      await removeSearchHistoryById({ id, userId: user.id });
    },
    [user.id],
  );
  const cards = useMemo(() => {
    return (
      data
        ?.filter(
          (card) =>
            !currentRemovedSearchHistoryIds.includes(card.searchItem.id),
        )
        ?.sort(
          (a, b) =>
            new Date(b.searchItem.createdAt).getTime() -
            new Date(a.searchItem.createdAt).getTime(),
        )
        .map((card) => (
          <SectionItem
            type={card.searchItem.type}
            key={card.searchItem.id}
            description={`searched on ${format(new Date(card.searchItem.createdAt), "yyy-MM-d")}`}
            link={
              card.searchItem.type === "ARTIST"
                ? `/artist/${card.user?.id}?playlist=search`
                : `/playlist/${card.playlist?.id}`
            }
            title={(card.user?.name ?? card.playlist?.title)!}
            image={card.user?.image ?? card.playlist?.imageSrc}
            artistData={card.user}
            playlistData={card.playlist}
            showPlayButton
            imageClasses={
              card.searchItem.type === "ARTIST" ? "rounded-full" : undefined
            }
            customElement={
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Button
                  onClick={() => {
                    void removeFromHistoryHandler(card.searchItem.id);
                  }}
                  size="icon"
                  variant="outline"
                  className="absolute right-2 top-2 rounded-full"
                >
                  <FaX />
                </Button>
              </div>
            }
          />
        )) ?? []
    );
  }, [currentRemovedSearchHistoryIds, data, removeFromHistoryHandler]);

  return (
    <RenderSectionItems
      titleClasses="pt-0"
      containerClasses="mb-4"
      isLoading={isLoading}
      cardsContainerClasses="gap-2"
      cards={cards}
      title="Recent Searches"
    />
  );
}
