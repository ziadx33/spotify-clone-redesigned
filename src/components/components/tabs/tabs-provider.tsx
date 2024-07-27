"use client";

import { setTabs, type TabsSliceType } from "@/state/slices/tabs";
import { type AppDispatch } from "@/state/store";
import { type ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

export function TabsProvider({
  tabs,
  children,
}: {
  tabs: TabsSliceType;
  children: ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(setTabs(tabs));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return children;
}
