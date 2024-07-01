import { type TrackFilters } from "@/types";

const AUTH_ROUTES = ["/login", "/register", "/verification-token"];

const CATEGORIES = ["Playlists", "Artists", "Podcasts & Shows"];

const DEFAULT_TRACK_FILTERS_DATA: TrackFilters = {
  album: null,
  artist: null,
  sortBy: "custom order",
  dateAdded: null,
  duration: null,
  title: null,
  viewAs: "LIST",
  customOrder: true,
};

export const SUPABASE_BUCKET_URL =
  "https://hvillzcyzejfbqcubhwi.supabase.co/storage/v1/object/public";

export { AUTH_ROUTES, CATEGORIES, DEFAULT_TRACK_FILTERS_DATA };
