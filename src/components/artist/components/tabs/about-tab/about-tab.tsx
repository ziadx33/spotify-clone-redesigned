import { type User } from "@prisma/client";

export function AboutTab({ artist }: { artist: User }) {
  return (
    <div className="mt-8 flex gap-6">
      <p className="w-3/4">{artist.about}</p>
      <div className="w-1/4">
        <h1 className="m-0 p-0 text-3xl font-bold">
          {artist.followers.length}
        </h1>{" "}
        <span className="text-sm text-muted-foreground">followers</span>
      </div>
    </div>
  );
}
