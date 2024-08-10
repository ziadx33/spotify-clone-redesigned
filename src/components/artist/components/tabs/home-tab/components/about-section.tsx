import { Card } from "@/components/ui/card";
import { type User } from "@prisma/client";
import Image from "next/image";
import { type Dispatch, type SetStateAction } from "react";
import { type tabs } from "../../../tabs";
import { Badge } from "@/components/ui/badge";

type ArtistPickSectionProps = {
  data: User;
  setCurrentTab: Dispatch<SetStateAction<(typeof tabs)[number]>>;
};

export function AboutSection({ data, setCurrentTab }: ArtistPickSectionProps) {
  return (
    <Card
      onClick={() => setCurrentTab("about")}
      title={`see ${data.name} full about`}
      className="flex h-fit w-5/6 flex-col overflow-hidden rounded-lg p-0 hover:cursor-pointer"
    >
      <div className="relative h-48 w-full">
        <Image
          src={data.aboutImage ?? ""}
          fill
          alt={data.name ?? ""}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <p className="line-clamp-5">{data.about}</p>
        <div className="flex gap-2">
          {(data.genres as string[]).map((genre) => (
            <Badge key={genre}>{genre.replace("_", " ").toLowerCase()}</Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
