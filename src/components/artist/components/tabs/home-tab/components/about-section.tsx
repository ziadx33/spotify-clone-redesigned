import { Card } from "@/components/ui/card";
import { type User } from "@prisma/client";
import Image from "next/image";
import { type tabs } from "../../../tabs";
import { Badge } from "@/components/ui/badge";
import { enumParser } from "@/utils/enum-parser";
import { cn } from "@/lib/utils";

type ArtistPickSectionProps = {
  data: User;
  setCurrentTab?: (value: (typeof tabs)[number]) => void;
};

export function AboutSection({ data, setCurrentTab }: ArtistPickSectionProps) {
  return (
    <Card
      onClick={() => setCurrentTab?.("about")}
      title={`see ${data.name} full about`}
      className={cn(
        "flex h-fit w-5/6 flex-col overflow-hidden rounded-lg p-0 hover:cursor-pointer",
        !data.aboutImage && "flex-row",
      )}
    >
      {data.aboutImage ? (
        <div className="relative h-48 w-full">
          <Image
            src={data.aboutImage ?? ""}
            fill
            alt={data.name ?? ""}
            className="object-cover"
          />
        </div>
      ) : (
        <div className="p-2 pr-0">
          <div className="relative h-full max-h-[90px] w-[80px]">
            <Image
              src={data.image ?? ""}
              fill
              alt={data.name ?? ""}
              className="size-[80px] rounded-lg object-cover"
            />
          </div>
        </div>
      )}
      <div className="flex max-w-[80%] flex-col gap-2 p-4">
        <p className="line-clamp-5 ">
          {data.about} Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Aliquid consectetur illo, libero unde aperiam aut expedita
          necessitatibus recusandae, dolor voluptatibus excepturi facere atque
          maxime reprehenderit tempora quis odio? Excepturi, alias.
        </p>
        <div className="flex gap-2">
          {(data.genres as string[]).map((genre) => (
            <Badge key={genre}>{enumParser(genre)}</Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
