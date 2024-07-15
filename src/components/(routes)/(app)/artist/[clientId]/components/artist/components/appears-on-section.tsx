import { getAppearsPlaylists } from "@/server/actions/playlist";
import { type User } from "@prisma/client";
import { AppearsOnItems } from "./appears-on-items";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function AppearsOnSection({ artist }: { artist: User }) {
  const data = await getAppearsPlaylists({ creatorId: artist.id });
  return (
    <div className="w-full flex-col">
      <div className="flex items-center justify-between">
        <h1 className="mb-4 text-3xl font-semibold">Appears On</h1>
        <Button asChild variant="link">
          <Link href={`/artist/${artist.id}/appears-on`}>show more</Link>
        </Button>
      </div>
      <AppearsOnItems albums={data ?? []} />
    </div>
  );
}
