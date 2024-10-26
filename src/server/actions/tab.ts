"use server";

import { type TabsSliceType } from "@/state/slices/tabs";
import { db } from "../db";
import { type Tab } from "@prisma/client";

export const getTabs = async ({
  userId,
  email,
}: {
  userId?: string;
  email?: string;
}): Promise<TabsSliceType> => {
  try {
    const tabs = await db.tab.findMany({
      where: {
        userId,
        User: { email },
      },
    });

    return {
      data: tabs,
      status: "success",
      error: null,
    };
  } catch (error) {
    throw {
      status: "error",
      error: (error as { message: string }).message,
      data: null,
    };
  }
};

export type AddTabToUserTabsParams = Parameters<
  (typeof db)["tab"]["create"]
>["0"]["data"];

export const addTabToUserTabs = async (data: AddTabToUserTabsParams) => {
  try {
    const createdTab = await db.tab.create({
      data,
    });
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
