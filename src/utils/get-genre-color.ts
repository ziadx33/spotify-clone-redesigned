import { type $Enums } from "@prisma/client";

export const getGenreColor = (genre: $Enums.GENRES) => {
  if (genre === "TRAP") return "#138A09";
  if (genre === "OLD_SCHOOL") return "#D53F01";
};
