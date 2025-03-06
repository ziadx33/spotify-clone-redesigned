"use server";

import { revalidateTag } from "next/cache";
import { db } from "../db";
import { type Tab } from "@prisma/client";

export type AddTabToUserTabsParams = Parameters<
  (typeof db)["tab"]["create"]
>["0"]["data"];

export const addTabToUserTabs = async (data: AddTabToUserTabsParams) => {
  try {
    const createdTab = await db.tab.create({
      data,
    });
    revalidateTag(`user-tabs-${data?.userId}`);
    return createdTab;
  } catch (error) {
    throw { error };
  }
};

export const removeTabFromUserTabs = async (id: string) => {
  try {
    const removedTab = await db.tab.delete({
      where: {
        id,
      },
    });
    revalidateTag(`user-tabs-${removedTab.userId}`);
    return removedTab;
  } catch (error) {
    throw { error };
  }
};

export const updateTabFromUserTabs = async ({
  id,
  updateData,
}: {
  id: string;
  updateData: Partial<Tab>;
}) => {
  try {
    const updatedTab = await db.tab.update({
      where: {
        id,
      },
      data: updateData,
    });
    revalidateTag(`user-tabs-${updatedTab.userId}`);
    return updatedTab;
  } catch (error) {
    throw { error };
  }
};

export type ChangeCurrentTabPrams = {
  id: string;
  userId: string;
  tabIds: string[];
  currentBoolean?: boolean;
};
