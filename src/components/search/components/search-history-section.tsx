import { SectionItem } from "@/components/components/section-item";
import { RenderSectionItems } from "@/components/render-section-items";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { revalidate } from "@/server/actions/revalidate";
import {
  getSearchHistory,
  removeSearchHistoryById,
} from "@/server/actions/search-history";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { FaX } from "react-icons/fa6";

export function SearchHistorySection() {
  const { data: user } = useSession();
  const [currentRemovedSearchHistoryIds, setCurrentRemovedSearchHistoryIds] =
    useState<string[]>([]);
  const { data, isLoading } = useQuery({
    queryKey: ["search-history"],
    queryFn: async () => {
      const searchHistory = await getSearchHistory(user?.user?.id ?? "");
      return searchHistory;
    },
    enabled: !!user?.user?.id,
  });
  const removeFromHistoryHandler = async (id: string) => {
    setCurrentRemovedSearchHistoryIds((v) => [...v, id]);
    await removeSearchHistoryById(id);
    revalidate(`/search`);
  };
  const cards = useMemo(() => {
    return (
      data
        ?.filter((card) => !currentRemovedSearchHistoryIds.includes(card.id))
        ?.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .map((card) => (
          <SectionItem
            key={card.id}
            description={`searched on ${format(new Date(card.createdAt), "yyy-MM-d")}`}
            link={card.href}
            title={card.title}
            image={card.image}
            imageClasses={card.type === "ARTIST" ? "rounded-full" : undefined}
            customElement={
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Button
                  onClick={() => {
                    void removeFromHistoryHandler(card.id);
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
  }, [currentRemovedSearchHistoryIds, data]);

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
