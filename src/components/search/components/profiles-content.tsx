/* eslint-disable react-hooks/exhaustive-deps */
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

type ProfilesContentProps = {
  users: User[];
  query: string;
  SearchClickFn: NavigateClickParams;
};

export function ProfilesContent({
  users,
  query,
  SearchClickFn,
}: ProfilesContentProps) {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.2,
  });
  const currentArtistsLength = useRef(10);
  const { isLoading, data, refetch } = useQuery({
    queryKey: [`profiles-tab-${query}`],
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
  }, [isIntersecting]);
  const cards = useMemo(() => {
    const datum = data ?? users;
    return (
      datum
        ?.filter((user) => user.type === "USER")
        .map((user, ix) => {
          return (
            <SectionItem
              artistData={user}
              onClick={SearchClickFn}
              key={user.id}
              description="Profile"
              title={user.name}
              link={`/artist/${user.id}?playlist=search`}
              image={user.image ?? ""}
              type="ARTIST"
              ref={ix === datum.length ? ref : null}
            />
          );
        }) ?? []
    );
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
