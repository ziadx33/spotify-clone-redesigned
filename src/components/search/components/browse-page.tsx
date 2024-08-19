import { Navigate } from "@/components/navigate";
import { enumParser } from "@/utils/enum-parser";
import { getGenreColor } from "@/utils/get-genre-color";
import { $Enums } from "@prisma/client";
import { useMemo } from "react";

export function BrowsePage() {
  const genres = useMemo(() => {
    return Object.keys($Enums.GENRES).map((key) => {
      const parsedKey = enumParser(key);
      return (
        <Navigate
          key={key}
          data={{
            href: `/search/genre?genre=${key}`,
            title: parsedKey ?? "unknown",
            type: "PLAYLIST",
          }}
          href={`/search/genre?genre=${key}`}
          className="flex size-40 rounded-lg p-4 "
          style={{
            backgroundColor: getGenreColor(key as $Enums.GENRES),
          }}
        >
          <span className="text-lg font-bold">{parsedKey}</span>
        </Navigate>
      );
    });
  }, []);
  return (
    <div className="flex flex-col">
      <h1 className="mb-6 text-2xl font-bold">Browse All</h1>
      <div className="flex flex-wrap gap-2">{genres}</div>
    </div>
  );
}
