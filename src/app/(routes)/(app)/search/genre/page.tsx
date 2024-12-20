import { type $Enums } from "@prisma/client";
import { redirect } from "next/navigation";
import { Loading } from "@/components/genre/loading";
import dynamic from "next/dynamic";

const Genre = dynamic(
  () => import("@/components/genre").then((file) => file.Genre),
  {
    loading: Loading,
  },
);

export default async function GenrePage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: $Enums.GENRES }>;
}) {
  const { genre } = await searchParams;
  if (!genre) redirect("/search?query=&tab=all");
  return <Genre genre={genre} />;
}
