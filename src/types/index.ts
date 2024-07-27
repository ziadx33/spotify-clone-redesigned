export type TrackFilters = {
  title: "ASC" | "DSC" | null;
  album: "ASC" | "DSC" | null;
  artist: "ASC" | "DSC" | null;
  dateAdded: "ASC" | "DSC" | null;
  duration: "ASC" | "DSC" | null;
  sortBy: string;
  customOrder: boolean;
  viewAs: "LIST" | "COMPACT";
};

export type ElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ElementType> ? ElementType : never;
