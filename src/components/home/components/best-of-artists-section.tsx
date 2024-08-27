"use client";

import { AvatarData } from "@/components/avatar-data";
import { SectionItem } from "@/components/components/section-item";
import { RenderSectionItems } from "@/components/render-section-items";
import { getBestOfArtists } from "@/server/actions/track";
import { getRandomValue } from "@/utils/get-random-value";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState, useMemo, useRef } from "react";
import { PlaylistDialog } from "./playlist-dialog";
import { useSession } from "@/hooks/use-session";

export function BestOfArtistsSection() {
  const { data: user } = useSession();
  const { data } = useQuery({
    queryKey: [`best-of-artists-section`],
    queryFn: async () => {
      const tracksData = await getBestOfArtists(user?.user?.id ?? "");
      return tracksData;
    },
    enabled: !!user?.user?.tracksHistory,
  });

  const colors = useRef([
    "#8BD7CB",
    "#E4BABE",
    "#B0D8B4",
    "#DD6990",
    "#F3C168",
    "#007bff",
  ]);

  const usedColors = useRef<string[]>([]);
  const getRandomMixColor = useCallback(() => {
    const randomColor = getRandomValue(
      colors.current.filter((color) => !usedColors.current.includes(color)),
    );
    usedColors.current.push(randomColor);
    return randomColor;
  }, [colors, usedColors]);

  const [activeDialog, setActiveDialog] = useState<number | null>(null);

  const cardsColors = useMemo(() => {
    return data?.authors?.map(() => getRandomMixColor());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getRandomMixColor, data?.authors]);

  const cards = useMemo(() => {
    return (
      data?.authors?.map((datum, index) => {
        const color = cardsColors?.[index];

        const relatedTracks = data.tracks?.filter(
          (track) =>
            track.authorId === datum.id || track.authorIds.includes(datum.id),
        );

        const relatedAlbums = data.albums?.filter(
          (album) => album.creatorId === datum.id,
        );

        const relatedAuthorsIds = relatedTracks
          .map((track) => [track.authorId, ...track.authorIds])
          .flat();

        const relatedAuthors = data.authors.filter((author) =>
          relatedAuthorsIds.includes(author.id),
        );

        const dialogData = {
          tracks: relatedTracks ?? [],
          albums: relatedAlbums ?? [],
          authors: relatedAuthors ?? [],
        };

        return (
          <Dialog
            key={index}
            onOpenChange={(open) => setActiveDialog(open ? index : null)}
          >
            <DialogTrigger>
              <SectionItem
                type="PLAYLIST"
                title={datum.name}
                showPlayButton
                customImage={
                  <div className="size-full overflow-hidden rounded-sm">
                    <AvatarData
                      src={datum?.image ?? ""}
                      containerClasses="size-full rounded-sm"
                    />
                    <div className="absolute bottom-5 flex items-center gap-2">
                      <div
                        style={{ backgroundColor: color }}
                        className="h-5 w-1.5"
                      />
                      <h5 className="font-bold">This is {datum.name}</h5>
                    </div>
                    <div
                      style={{ backgroundColor: color }}
                      className="absolute bottom-0 z-10 h-2.5 w-full rounded-b-sm"
                    />
                  </div>
                }
                description={`This is ${datum.name}`}
              />
            </DialogTrigger>
            <PlaylistDialog isActive={activeDialog === index} {...dialogData} />
          </Dialog>
        );
      }) ?? []
    );
  }, [activeDialog, data, cardsColors]);

  return (
    <RenderSectionItems
      cards={cards}
      title="Best of artists"
      cardsContainerClasses="gap-2"
      isLoading={!data}
    />
  );
}
