import { type User } from "@prisma/client";
import { SectionItem } from "../components/section-item";

type FansLikeProps = {
  artists: User[];
};

export function Following({ artists }: FansLikeProps) {
  return (
    <div className="flex flex-col gap-6 p-6  pt-14">
      <h1 className="pt-8 text-3xl font-bold hover:underline">Following</h1>
      <div className="flex flex-wrap">
        {artists.map((user: User) => {
          return (
            <SectionItem
              imageClasses="rounded-full"
              key={user.id}
              alt={user.name ?? ""}
              title={user.name ?? ""}
              image={user.image ?? ""}
              description="artist"
              link={`/artist/${user.id}`}
            />
          );
        })}
      </div>
    </div>
  );
}
