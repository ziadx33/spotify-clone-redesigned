import { NonSortTable } from "@/components/components/non-sort-table";
import { Navigate } from "@/components/navigate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CircleItems } from "@/components/ui/circle-items";
import { Table } from "@/components/ui/table";
import { type SearchQueryReturn } from "@/server/actions/search";
import { type Track } from "@prisma/client";
import Image from "next/image";
import { useMemo } from "react";
import { FaPlay } from "react-icons/fa";

export function AllContent({ tracks }: SearchQueryReturn) {
  const { topTrackCreatorData, topTrack } = useMemo(() => {
    const topTrack = (tracks.tracks as [Track])[0];
    const topTrackCreatorData = tracks.authors?.find(
      (artist) => topTrack.authorId === artist.id,
    );
    return { topTrackCreatorData, topTrack };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex size-full flex-col">
      <div className="flex w-full gap-6">
        <div className="flex flex-col">
          <b className="mb-2 text-3xl">Top result</b>
          <Card className="h-[217px] w-[437.688px] border-none bg-background transition-colors hover:bg-muted">
            <CardContent className="size-full p-0">
              <Navigate
                data={{
                  href: `/playlist/${topTrack.albumId}`,
                  title: topTrack.title ?? "unknown",
                  type: "ARTIST",
                }}
                href={`/playlist/${topTrack.albumId}`}
                className="group relative flex size-full flex-col overflow-hidden p-5"
              >
                <Image
                  src={topTrack.imgSrc}
                  width={92}
                  height={92}
                  alt={topTrack.title}
                  className="rounded-lg shadow-2xl"
                />
                <b className="mt-6 text-3xl">{topTrack?.title}</b>
                <CircleItems
                  items={[
                    "Track",
                    <span
                      key={topTrackCreatorData?.name}
                      className="text-white"
                    >
                      {topTrackCreatorData?.name}
                    </span>,
                  ]}
                />
                <Button
                  size={"icon"}
                  className="absolute -bottom-20 right-4 h-16 w-16 rounded-full opacity-0 transition-all duration-300 hover:bg-primary group-hover:bottom-4 group-hover:opacity-100"
                >
                  <FaPlay size={20} />
                </Button>
              </Navigate>
            </CardContent>
          </Card>
        </div>
        <div className="flex w-full flex-col">
          <b className="mb-2 text-3xl">Tracks</b>
          <Table className="w-full">
            <NonSortTable
              showHead={false}
              viewAs="LIST"
              limit={4}
              hidePlayButton
              data={tracks}
            />
          </Table>
        </div>
      </div>
    </div>
  );
}
