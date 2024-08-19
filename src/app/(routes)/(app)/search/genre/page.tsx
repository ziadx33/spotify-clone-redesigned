import { Genre } from "@/components/genre";
import { type $Enums } from "@prisma/client";
import { redirect } from "next/navigation";

export default function GenrePage({
  searchParams,
}: {
  searchParams: { genre?: $Enums.GENRES };
}) {
  if (!searchParams.genre) redirect("/search?query=&tab=all");
  return <Genre genre={searchParams.genre} />;
}
