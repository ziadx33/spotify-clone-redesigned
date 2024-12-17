"use client";

import { useSelector } from "react-redux";
import { type RootState } from "@/state/store";

export const useFolders = () => {
  const folders = useSelector((state: RootState) => state.folders);

  return folders;
};
