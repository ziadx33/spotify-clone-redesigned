import { BestOfArtistsSection } from "./components/best-of-artists-section";
import { MadeForYouSection } from "./components/made-for-you-section";
import { PlaylistsSection } from "./components/playlists-section";
import { YourFavArtists } from "./components/your-fav-artists";

export async function Home() {
  return (
    <div className="flex flex-col px-4 py-8">
      <PlaylistsSection />
      <MadeForYouSection />
      <YourFavArtists />
      <BestOfArtistsSection />
    </div>
  );
}
