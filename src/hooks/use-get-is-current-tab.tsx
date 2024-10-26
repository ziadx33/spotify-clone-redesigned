import { usePathname, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";

export function useIsCurrentTab(url: string) {
  const pathname = usePathname();
  const searchParams = useSearchParams().toString();

  const extractSearchParams = useCallback((href: string): string => {
    const searchPart = href.split("?")[1];
    return searchPart ? new URLSearchParams(searchPart).toString() : "";
  }, []);

  const isMatchingTab = useCallback(
    (href: string): boolean => {
      const [hrefPathname, hrefSearchParams] = href.split("?");
      const shouldIgnoreSearchParams = hrefPathname === "/search";

      const extractedSearchParams =
        !shouldIgnoreSearchParams && hrefSearchParams
          ? extractSearchParams(href)
          : "";

      return (
        pathname === hrefPathname &&
        (!shouldIgnoreSearchParams || searchParams === extractedSearchParams)
      );
    },
    [pathname, searchParams, extractSearchParams],
  );

  const [isCurrentTab, setIsCurrentTab] = useState(() => isMatchingTab(url));
  const currentTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const currentTabStatus = isMatchingTab(url);
    if (currentTabStatus !== isCurrentTab) {
      setIsCurrentTab(currentTabStatus);
    }
    if (currentTabStatus) {
      currentTabRef.current?.scrollIntoView();
    }
  }, [pathname, searchParams, url, isCurrentTab, isMatchingTab]);

  return { isCurrentTab, currentTabRef };
}
