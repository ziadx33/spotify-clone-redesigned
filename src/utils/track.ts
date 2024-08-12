import { DEFAULT_TRACK_FILTERS_DATA } from "@/constants";
import { type TrackFilters } from "@/types";
import { type Dispatch, type SetStateAction } from "react";

export function handleTrackFilterChange(
  setFilters: Dispatch<SetStateAction<TrackFilters>>,
) {
  return (name: keyof TrackFilters) =>
    setFilters((data) => ({
      ...DEFAULT_TRACK_FILTERS_DATA,
      viewAs: data.viewAs,
      [name]:
        data[name] === "DSC" ? null : data[name] === "ASC" ? "DSC" : "ASC",
      sortBy: data[name] === "DSC" ? "custom order" : name,
    }));
}
