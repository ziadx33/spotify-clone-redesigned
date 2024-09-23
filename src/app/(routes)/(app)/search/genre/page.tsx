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

export default function GenrePage({
  searchParams,
}: {
  searchParams: { genre?: $Enums.GENRES };
}) {
  if (!searchParams.genre) redirect("/search?query=&tab=all");
  return <Genre genre={searchParams.genre} />;
}
