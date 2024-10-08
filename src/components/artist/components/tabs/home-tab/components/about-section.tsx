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
        <div className="relative w-full">
          <Image
            src={data.aboutImage ?? ""}
            fill
            alt={data.name ?? ""}
            className=""
          />
        </div>
      ) : (
        <div className="p-2 pr-0">
          <div className="relative size-[80px]">
            <Image
              src={data.image ?? ""}
              fill
              alt={data.name ?? ""}
              className="size-[80px] rounded-lg"
            />
          </div>
        </div>
      )}
      <div
        className={cn(
          "flex flex-col gap-2 p-4",
          data.aboutImage ? "w-full" : "max-w-[80%]",
        )}
      >
        <p className="line-clamp-5">{data.about}</p>
        <div className="flex gap-2">
          {(data.genres as string[]).map((genre) => (
            <Badge key={genre}>{enumParser(genre)}</Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
