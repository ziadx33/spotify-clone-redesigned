import { SectionItem } from "@/components/components/section-item";
import { RenderSectionItems } from "@/components/render-section-items";
import { useSession } from "@/hooks/use-session";
import { getSearchHistory } from "@/server/actions/search-history";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useMemo } from "react";

export function SearchHistorySection() {
  const { data: user } = useSession();
  const { data, isLoading } = useQuery({
    queryKey: ["search-history"],
    queryFn: async () => {
      const searchHistory = await getSearchHistory(user?.user?.id ?? "");
      return searchHistory;
    },
    enabled: !!user?.user?.id,
  });
  const cards = useMemo(() => {
    return data
      ?.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .map((card) => {
        return (
          <SectionItem
            key={card.id}
            description={
              card.type === "ARTIST"
                ? "Artist"
                : // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  `searched on ${format(new Date(card.createdAt), "yyy-MM-d")}`
            }
            link={card.href}
            title={card.title}
            image={card.image}
            imageClasses={card.type === "ARTIST" ? "rounded-full" : undefined}
            showPlayButton
          />
        );
      });
  }, [data]);
  return (
    <RenderSectionItems
      titleClasses="pt-0"
      containerClasses="mb-4"
      isLoading={isLoading}
      cardsContainerClasses="gap-2"
      cards={cards ?? []}
      title="Recent Searches"
    />
  );
}
