import { usePlaylists } from "./use-playlists";

export function usePlaylist(id: string) {
  const playlists = usePlaylists();
  const data = playlists.data?.find((playlist) => playlist.id === id);
  return { data, error: playlists.error, status: playlists.status };
}
