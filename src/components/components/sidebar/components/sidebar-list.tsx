import { SidebarPlaylistsAccordion } from "./sidebar-playlists-accordion";
import { SidebarArtistsAccordion } from "./sidebar-artists-accordion";
import { SidebarAlbumsAccordion } from "./sidebar-albums-accordion";
import { SidebarLikedSongsButton } from "./sidebar-liked-songs-button";
import { SidebarPinsAccordion } from "./sidebar-pins-accordion";
import { SidebarFoldersAccordion } from "./sidebar-folders-accordion";
import { SidebarAccordion } from "./sidebar-accordion";

export function SidebarList() {
  return (
    <SidebarAccordion>
      <SidebarPinsAccordion />
      <SidebarArtistsAccordion />
      <SidebarFoldersAccordion />
      <SidebarPlaylistsAccordion />
      <SidebarAlbumsAccordion />
      <SidebarLikedSongsButton />
    </SidebarAccordion>
  );
}
