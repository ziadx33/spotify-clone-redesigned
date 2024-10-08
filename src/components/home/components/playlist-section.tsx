"use client";

import { SectionItem } from "@/components/components/section-item";
import { RenderSectionItems } from "@/components/render-section-items";
import { EditSectionButton } from "./edit-section-button";
import { format } from "date-fns";
import { type PlaylistSectionType } from "./prefrences-provider";
import { PopularPlaylistsSection } from "./popular-playlists-section";

type PlaylistsSectionProps = {
  playlist: PlaylistSectionType;
  userId: string;
  sectionId: string;
};

export function PlaylistSection({
  playlist: { playlist, content },
  userId,
  sectionId,
}: PlaylistsSectionProps) {
  return (
    <RenderSectionItems
      buttons={[
        <EditSectionButton
          key="edit-button"
          sectionId={sectionId}
          userId={userId}
        />,
      ]}
      cards={content?.map((playlist) => {
        return (
          <SectionItem
            type="PLAYLIST"
            playlistData={playlist}
            link={`/playlist/${playlist.id}`}
            key={playlist.id}
            title={playlist.title ?? ""}
            image={playlist.imageSrc ?? ""}
            showPlayButton
            description={`${format(new Date(playlist.createdAt), "yyy")} - ${playlist.type.toLowerCase()}`}
          />
        );
      })}
      title={playlist.title}
      fallbackComponent={<PopularPlaylistsSection />}
    />
  );
}
