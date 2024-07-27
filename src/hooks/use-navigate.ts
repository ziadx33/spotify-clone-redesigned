import { useRouter } from "next/navigation";
import { useTabs } from "./use-tabs";
import { type Tab } from "@prisma/client";
import { useSession } from "./use-session";

export type NavigateProps = {
  href: string;
  data: Partial<Tab>;
};

export const useNavigate = ({ href, data }: NavigateProps) => {
  const { currentTab, updateTab, getTabByHref, addTab } = useTabs();
  const navigateTab = getTabByHref(data.href ?? "");
  console.log("stop", navigateTab);
  const router = useRouter();
  const navigate = (create = true) => {
    if (!navigateTab && !create) {
      return void addTab({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        title: data.title ?? "",
        href: data.href,
        type: data.type,
      });
    }
    if (!currentTab || href === currentTab.href || navigateTab)
      return router.push(href);
    void updateTab({ id: currentTab.id, tabData: data });
    router.push(href);
  };
  return navigate;
};
