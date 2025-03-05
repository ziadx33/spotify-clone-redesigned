import { type $Enums, type Track, type User } from "@prisma/client";
import { baseAPI } from "../api";

export const getHomeMadeForYouSectionData = async ({
  historyTracksIds,
}: {
  historyTracksIds: string[];
}) => {
  const params = new URLSearchParams();

  if (historyTracksIds)
    params.append("historyTracksIds", historyTracksIds.join(","));

  const response = await baseAPI.get<
    { tracks: Track[]; authors: User[]; genre: $Enums.GENRES }[]
  >(`/api/sections/made-for-you?${params.toString()}`);

  return response.data;
};
