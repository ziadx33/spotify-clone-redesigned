import { Accordion } from "@/components/ui/accordion";
import { SidebarPlaylistsAccordion } from "./sidebar-playlists-accordion";
import { SidebarArtistsAccordion } from "./sidebar-artists-accordion";
import { SidebarAlbumsAccordion } from "./sidebar-albums-accordion";
import { SidebarLikedSongsButton } from "./sidebar-liked-songs-button";
import { SidebarPinsAccordion } from "./sidebar-pins-accordion";

export function SidebarList() {
  return (
    <Accordion type="multiple" className="w-full">
      <SidebarPinsAccordion />
      <SidebarArtistsAccordion />
      <SidebarPlaylistsAccordion />
      <SidebarAlbumsAccordion />
      <SidebarLikedSongsButton />
    </Accordion>
  );
}
