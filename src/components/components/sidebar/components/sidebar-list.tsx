import { Accordion } from "@/components/ui/accordion";
import { SidebarPlaylistsAccordion } from "./sidebar-playlists-accordion";
import { SidebarArtistsAccordion } from "./sidebar-artists-accordion";
import { SidebarAlbumsAccordion } from "./sidebar-albums-accordion";
import { SidebarLikedSongsButton } from "./sidebar-liked-songs-button";

export function SidebarList() {
  return (
    <Accordion type="multiple" className="w-full">
      <SidebarArtistsAccordion />
      <SidebarPlaylistsAccordion />
      <SidebarAlbumsAccordion />
      <SidebarLikedSongsButton />
    </Accordion>
  );
}
