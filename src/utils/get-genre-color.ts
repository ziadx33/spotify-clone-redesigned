import { $Enums } from "@prisma/client";

const genreColors: Record<$Enums.GENRES, string> = {
  [$Enums.GENRES.TRAP]: "#2E8B57",
  [$Enums.GENRES.OLD_SCHOOL]: "#FF6347",
  [$Enums.GENRES.ROCK]: "#FF4500",
  [$Enums.GENRES.POP]: "#FF1493",
  [$Enums.GENRES.JAZZ]: "#4682B4",
  [$Enums.GENRES.HIP_HOP]: "#32CD32",
  [$Enums.GENRES.ELECTRONIC]: "#8A2BE2",
  [$Enums.GENRES.CLASSICAL]: "#6A5ACD",
  [$Enums.GENRES.REGGAE]: "#FFD700",
  [$Enums.GENRES.COUNTRY]: "#DAA520",
  [$Enums.GENRES.BLUES]: "#708090",
  [$Enums.GENRES.RNB]: "#FF69B4",
  [$Enums.GENRES.METAL]: "#8B0000",
  [$Enums.GENRES.FOLK]: "#4682B4",
  [$Enums.GENRES.TECHNO]: "#20B2AA",
  [$Enums.GENRES.AMBIENT]: "#D3D3D3",
  [$Enums.GENRES.GRIME]: "#2F4F4F",
  [$Enums.GENRES.HOUSE]: "#DCDCDC",
  [$Enums.GENRES.INDIE]: "#FF8C00",
  [$Enums.GENRES.LATIN]: "#FFC0CB",
};

export const getGenreColor = (genre: $Enums.GENRES) => {
  return genreColors[genre] ?? "#FFFFFF";
};
