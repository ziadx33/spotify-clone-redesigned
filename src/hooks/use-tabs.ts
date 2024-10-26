"use client";

import {
  addTabToUserTabs,
  removeTabFromUserTabs,
  updateTabFromUserTabs,
  type AddTabToUserTabsParams,
} from "@/server/actions/tab";
import { addTab, removeTab, updateTab } from "@/state/slices/tabs";
import { type AppDispatch, type RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "./use-session";
import { usePathname, useRouter } from "next/navigation";
import { type Tab } from "@prisma/client";

export function useTabs() {
  const tabsData = useSelector((state: RootState) => state.tabs);
  const pathname = usePathname();

  const dispatch = useDispatch<AppDispatch>();
  const user = useSession();
  const router = useRouter();

  const addTabFn = async (data: AddTabToUserTabsParams) => {
    router.push(data?.href ?? "");
    const id = crypto.randomUUID();
    dispatch(
      addTab({
        href: data?.href ?? "",
        id,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        title: data?.title ?? "",
        type: data?.type ?? "PLAYLIST",
        userId: user.data?.user?.id ?? "",
      }),
    );
    const updateData = await addTabToUserTabs({
      userId: user.data?.user?.id as unknown as undefined,
      ...data,
    });
    dispatch(updateTab({ updateData, id }));
  };
  const removeTabFn = async (id: string) => {
    dispatch(removeTab(id));
    void removeTabFromUserTabs(id);
    if (currentTab?.id === id) {
      router.push("/");
    }
  };
  const updateTabFn = async ({
    id,
    tabData,
  }: {
    id: string;
    tabData: Partial<Tab>;
  }) => {
    dispatch(updateTab({ id, updateData: tabData }));
    await updateTabFromUserTabs({ id, updateData: tabData });
  };
  const getTabByHref = (href: string) => {
    return tabsData.data?.find((tab) => tab.href.startsWith(href));
  };
  const currentTab = getTabByHref(pathname);
  return {
    ...tabsData,
    addTab: addTabFn,
    removeTab: removeTabFn,
    currentTab,
    updateTab: updateTabFn,
    getTabByHref,
  };
}
