import { type User } from "@prisma/client";

export function Artist({ artist }: { artist: User }) {
  return <h1>Artist page {artist.name}</h1>;
}
