import { useRouter } from "next/navigation";
import { useTabs } from "./use-tabs";
import { type Tab } from "@prisma/client";

export type NavigateProps = {
  href?: string;
  data?: Partial<Tab>;
};

export const useNavigate = ({ href, data }: NavigateProps) => {
  const { currentTab, updateTab, getTabByHref, addTab } = useTabs();
  const router = useRouter();
  const navigate = (
    navigateHref?: NavigateProps["href"],
    navigateData?: NavigateProps["data"],
    create = true,
  ) => {
    const dataUsed = (data === undefined ? navigateData : data)!;
    const hrefUsed = (href === undefined ? navigateHref : href)!;
    console.log("stop shitting", href, navigateHref);
    const navigateTab = getTabByHref(dataUsed.href ?? "");
    if (!navigateTab && !create) {
      return void addTab({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        title: dataUsed?.title ?? "",
        href: dataUsed?.href,
        type: dataUsed?.type,
      });
    }
    if (!currentTab || href === currentTab.href || navigateTab)
      return router.push(hrefUsed);
    void updateTab({ id: currentTab.id, tabData: dataUsed });
    router.push(hrefUsed);
  };
  return navigate;
};
