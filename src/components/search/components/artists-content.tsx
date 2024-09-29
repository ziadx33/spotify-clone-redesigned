import { SectionItemSkeleton } from "@/components/artist/components/skeleton";
import {
  type NavigateClickParams,
  SectionItem,
} from "@/components/components/section-item";
import { getUsersBySearchQuery } from "@/server/actions/user";
import { type User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { useIntersectionObserver } from "usehooks-ts";

type ArtistsContentProps = {
  users: User[];
  query: string;
  SearchClickFn: NavigateClickParams;
};

export function ArtistsContent({
  users,
  query,
  SearchClickFn,
}: ArtistsContentProps) {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.2,
  });
  const currentArtistsLength = useRef(10);
  const { isLoading, data, refetch } = useQuery({
    queryKey: [`artists-tab-${query}`],
    queryFn: async () => {
      const fetchedTracks = await getUsersBySearchQuery({
        query,
        amount: currentArtistsLength?.current ?? 10,
        restartLength: 1,
      });
      return fetchedTracks;
    },
  });
  useEffect(() => {
    if (!isIntersecting) return;
    currentArtistsLength.current += 10;
    void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntersecting]);
  const cards = useMemo(() => {
    const datum = data ?? users;
    return (
      datum
        ?.filter((user) => user.type === "ARTIST")
        ?.map((user, i) => (
          <SectionItem
            artistData={user}
            key={user.id}
            onClick={SearchClickFn}
            description="Artist"
            title={user.name}
            link={`/artist/${user.id}?playlist=search`}
            image={user.image ?? ""}
            type="ARTIST"
            imageClasses="rounded-full"
            showPlayButton
            ref={i === datum.length ? ref : null}
          />
        )) ?? []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, users]);
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-2">
        {cards}
        {isLoading && <SectionItemSkeleton amount={10} />}
      </div>
    </div>
  );
}
