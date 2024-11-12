import { useExplore } from "@/hooks/use-explore";
import { type Track } from "@prisma/client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ExploreItem } from "./components/explore-item";
import { ExploreControls } from "./components/explore-controls";
import { type TrackSliceType } from "@/state/slices/tracks";
import { useTracks } from "@/hooks/use-tracks";
import { ScrollContainer } from "./components/scroll-container";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/hooks/use-session";
import { getTracksByGenres, getTracksByIds } from "@/server/actions/track";
import { type ExploreSliceData } from "@/state/slices/explore";

export function Explore() {
  const {
    data: { data: explore },
  } = useExplore();
  const { getTrack } = useTracks();
  const [exploreData, setExploreData] =
    useState<ExploreSliceData["data"]>(explore);
  const [currentItem, setCurrentItem] = useState<Track | undefined>(
    exploreData.tracks?.[0],
  );
  const { data: user } = useSession();

  const scrollFetchRef = useRef(0);
  const [initRender, setInitRender] = useState(false);

  const { data: exploreFetchData, refetch: refetchExploreData } = useQuery({
    queryKey: ["explore-data", scrollFetchRef.current],
    queryFn: async () => {
      const userData = user!.user!;
      const userTracks = await getTracksByIds({
        ids: userData.tracksHistory,
      });
      const genres = userTracks.map((track) => track.genres).flat();
      const curScrollValue = scrollFetchRef.current;
      console.log("fel hamam", curScrollValue);
      const tracks = await getTracksByGenres({
        genres,
        range: {
          from: curScrollValue,
          to: curScrollValue + 10,
        },
      });
      return tracks;
    },
    staleTime: 0,
    enabled: explore.randomly && !!user?.user?.id,
  });

  const isExploreFetchLoading =
    !exploreFetchData && explore.randomly && !initRender;

  const setExploreDataRefToFetchData = (data = exploreFetchData) => {
    if (!data || !explore.randomly) return;
    const returnData = {
      albums: [
        ...new Map(
          [...(exploreData.albums ?? []), ...(data.albums ?? [])].map(
            (album) => [album.id, album],
          ),
        ).values(),
      ],
      authors: [
        ...new Map(
          [...(exploreData.authors ?? []), ...(data.authors ?? [])].map(
            (author) => [author.id, author],
          ),
        ).values(),
      ],
      tracks: [
        ...new Map(
          [...(exploreData.tracks ?? []), ...(data.tracks ?? [])].map(
            (track) => [track.id, track],
          ),
        ).values(),
      ],
      randomly: true,
    };
    console.log("kaka", returnData);
    setExploreData(returnData);
    return returnData;
  };

  useEffect(() => {
    if (!exploreFetchData || !explore.randomly) return;
    if (!initRender) {
      setInitRender(true);

      const exploreFetchDataUsed = setExploreDataRefToFetchData();
      setCurrentItem(exploreFetchDataUsed?.tracks?.[0]);
    } else {
      console.log("kont w knot", exploreFetchData);
      setExploreDataRefToFetchData(exploreFetchData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exploreFetchData, explore.randomly]);

  const [data, setData] = useState<TrackSliceType[]>([]);

  useEffect(() => {
    if (!currentItem) return;
    const itemData = getTrack(exploreData, currentItem?.id);
    setData((items) => [...(items ?? []), itemData]);

    if (exploreData.randomly) {
      const lastIndexItem = (exploreData?.tracks?.length ?? 0) - 5;
      const lastItem = exploreData.tracks?.[lastIndexItem];
      if (currentItem.id === lastItem?.id) {
        console.log("enta elly nabart");
        scrollFetchRef.current = scrollFetchRef.current + 10;
        void refetchExploreData();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItem]);

  const currentItemData = useMemo(() => {
    return data.find((item) => item.track?.id === currentItem?.id);
  }, [data, currentItem]);

  console.log("I'm just bahawel", exploreData.tracks?.length);

  return (
    <ScrollContainer exploreData={exploreData} setCurrentItem={setCurrentItem}>
      <div className="flex size-fit items-center gap-4">
        <ExploreItem
          exploreData={exploreData}
          isExploreFetchLoading={isExploreFetchLoading}
          currentItemData={currentItemData}
        />
        <ExploreControls
          isExploreFetchLoading={isExploreFetchLoading}
          currentItemData={currentItemData}
        />
      </div>
    </ScrollContainer>
  );
}
