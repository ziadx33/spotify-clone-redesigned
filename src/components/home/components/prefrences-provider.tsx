"use client";

import { BestOfArtistsSection } from "./best-of-artists-section";
import { MadeForYouSection } from "./made-for-you-section";
import { PlaylistsSection } from "./playlists-section";
import { YourFavArtists } from "./your-fav-artists";
import {
  Fragment,
  useEffect,
  useMemo,
  type ReactNode,
  useState,
  useRef,
} from "react";
import {
  setPrefrence,
  type PrefrenceSliceType,
} from "@/state/slices/prefrence";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/state/store";
import { usePrefrences } from "@/hooks/use-prefrences";
import { type Playlist } from "@prisma/client";
import { PlaylistSection } from "./playlist-section";
import { useQuery } from "@tanstack/react-query";
import { getPlaylists } from "@/server/actions/playlist";
import { getTracksByPlaylistIds } from "@/server/actions/track";

export type PlaylistSectionType = {
  playlist: Playlist;
  content: Playlist[];
};

type PrefrencesProviderProps = {
  data: PrefrenceSliceType;
  userId: string;
};

export function PrefrencesProvider({ userId, data }: PrefrencesProviderProps) {
  const { data: prefrences, status } = usePrefrences();

  const dispatch = useDispatch<AppDispatch>();

  const [components, setComponents] = useState({
    "made for you": <MadeForYouSection userId={userId} />,
    "your favorite artists": <YourFavArtists userId={userId} />,
    "best of artists": <BestOfArtistsSection userId={userId} />,
  });

  useEffect(() => {
    dispatch(setPrefrence(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initRefetch = useRef(false);

  const { data: playlists, refetch } = useQuery({
    queryKey: ["prefrences"],
    queryFn: async () => {
      const sections = initRefetch.current
        ? prefrences?.homeLibSection
        : data?.data?.homeLibSection;
      if (!sections) {
        return [];
      }

      const playlists = await getPlaylists({
        playlistIds: sections ?? [],
      });

      const playlistsTracks = await getTracksByPlaylistIds({
        playlistIds: playlists.data?.map((playlist) => playlist.id) ?? [],
      });

      const playlistsContent = await getPlaylists({
        playlistIds: playlistsTracks.map((track) => track.albumId) ?? [],
      });

      const returnedData = playlists.data?.map((playlist) => {
        const tracks = playlistsTracks.filter((track) =>
          track.playlists.includes(playlist.id),
        );
        const tracksAlbumIds = tracks.map((track) => track.albumId);

        return {
          playlist,
          content:
            playlistsContent.data?.filter((playlist) =>
              tracksAlbumIds.includes(playlist.id),
            ) ?? [],
        };
      });

      initRefetch.current = true;

      return returnedData;
    },
  });

  useEffect(() => {
    if (initRefetch.current) void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefrences?.homeLibSection]);

  useEffect(() => {
    const comps: Record<string, ReactNode> = {};
    playlists?.forEach((plyst) => {
      const { playlist } = plyst;
      comps[playlist.title] = (
        <PlaylistSection
          playlist={plyst}
          key={playlist.id}
          userId={userId}
          sectionId={playlist.title}
        />
      );
    });
    setComponents((v) => ({ ...v, ...comps }));
  }, [playlists, userId]);

  const sortSections = (a: string, b: string, order: string[]) => {
    const indexA = order.indexOf(a);
    const indexB = order.indexOf(b);
    return indexA !== -1 && indexB !== -1
      ? indexA - indexB
      : indexA !== -1
        ? -1
        : indexB !== -1
          ? 1
          : 0;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mapComponents = (key: string) => {
    console.log("Rendering component for key:", key);
    return (
      <Fragment key={key}>
        {components[key as keyof typeof components]}
      </Fragment>
    );
  };

  const sections = useMemo(() => {
    const componentsKeys = Object.keys(components);
    if (status === "loading") return [];
    if (status === "error" || !prefrences)
      return componentsKeys.map(mapComponents);

    const {
      pinnedHomeSections = [],
      homeSectionsSort = [],
      hiddenHomeSections = [],
    } = prefrences ?? {};

    return componentsKeys
      .filter((key) => !hiddenHomeSections.includes(key))
      .sort((a, b) => sortSections(a, b, homeSectionsSort))
      .sort((a, b) => sortSections(a, b, pinnedHomeSections))
      .map(mapComponents);
  }, [components, status, prefrences, mapComponents]);

  return (
    <>
      <PlaylistsSection comps={components} />
      {sections}
    </>
  );
}
