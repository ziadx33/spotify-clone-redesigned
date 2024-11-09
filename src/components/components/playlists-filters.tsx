"use client";

import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/constants";
import { useCallback, useMemo } from "react";
import { Playlists } from "./playlists";
import { cn } from "@/lib/utils";
import { usePrefrences } from "@/hooks/use-prefrences";
import { type $Enums } from "@prisma/client";
import { editPrefrence } from "@/state/slices/prefrence";
import { editUserPrefrence } from "@/server/actions/prefrence";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/state/store";
import { revalidate } from "@/server/actions/revalidate";
import { useSession } from "@/hooks/use-session";

export function PlaylistFilters() {
  const { data: prefrence, error } = usePrefrences();

  const dispatch = useDispatch<AppDispatch>();
  const { data: user } = useSession();

  const badgeClickHandler = useCallback(
    async (category: $Enums.CATEGORIES) => {
      if (!user?.user?.id) return;
      const usedData = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        currentCategory:
          prefrence?.currentCategory === category ? undefined : category,
      };
      dispatch(editPrefrence(usedData));
      await editUserPrefrence({
        data: usedData,
        error,
        type: "set",
        userId: user.user.id,
      });
      revalidate("/");
    },
    [dispatch, error, prefrence?.currentCategory, user],
  );

  const categories = useMemo(() => {
    return CATEGORIES.map((category, categoryIndex) => (
      <Badge
        className="cursor-pointer text-nowrap"
        key={categoryIndex}
        variant={
          prefrence?.currentCategory === category ? "secondary" : "default"
        }
        onClick={() => badgeClickHandler(category)}
      >
        <span>{category}</span>
      </Badge>
    ));
  }, [badgeClickHandler, prefrence?.currentCategory]);

  return (
    <>
      <div
        className={cn("relative", !prefrence?.showSidebar ? "mb-4 h-6" : "")}
      >
        <div className="flex h-full w-full items-center gap-2 overflow-y-auto overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          {!prefrence?.showSidebar ? categories : undefined}
        </div>
      </div>
      <div className="flex w-full flex-col">
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
        <Playlists currentCategory={prefrence?.currentCategory} />
      </div>
    </>
  );
}
