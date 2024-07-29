/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { type MutableRefObject, useEffect, useRef } from "react";
import { useDebounceState } from "./use-debounce-state";

type UseSearchParams<T extends Record<string, string>> = {
  data?: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: () => any | Promise<any>;
  debounce?: boolean;
  controllers?: Record<keyof T | string, MutableRefObject<null | string>>;
};

export const useSearch = <T extends Record<string, string>>({
  data,
  onChange,
  debounce = false,
  controllers,
}: UseSearchParams<T>) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryParams = Object.fromEntries(searchParams) as unknown as T;

  const [normalValue, setDebounceValue, debouncedValue] =
    useDebounceState(queryParams);
  const initialized = useRef(false);

  type SetQueryProps = { name: keyof T; value: string };

  const mergeQueryParams = (
    existing: URLSearchParams,
    updates: SetQueryProps[],
  ) => {
    const newParams = new URLSearchParams(existing.toString());
    updates.forEach(({ name, value }) => {
      newParams.set(String(name), value);
    });
    return newParams.toString();
  };

  const getQueryValues = (queries: T) => {
    return Object.keys(queries).map((key) => ({
      name: key,
      value: queries[key] ?? "",
    }));
  };

  const getQueryValuesNameKey = (queries: SetQueryProps[]): T => {
    return queries.reduce(
      (accumulator: Record<string, string>, { name, value }) => {
        accumulator[name as string] = value;
        return accumulator;
      },
      {},
    ) as T;
  };

  useEffect(() => {
    if (!initialized.current) {
      const initialValues = getQueryValues({ ...queryParams, ...data });
      const mergedQueryString = mergeQueryParams(searchParams, initialValues);

      // Check if current URL matches the merged query string
      const currentQueryString = searchParams.toString();
      console.log(
        "stop mergin",
        mergedQueryString,
        currentQueryString,
        initialized.current,
      );
      if (currentQueryString !== mergedQueryString) {
        router.replace(`${pathname}?${mergedQueryString}`);
      }

      initialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const setControllers = (controllerData: T, runAfter?: () => unknown) => {
    if (!controllers) return;

    Object.keys(controllers).forEach((controller) => {
      const currentController = controllers[controller];
      if (currentController) {
        currentController.current = controllerData[controller] ?? null;
      }
    });
    runAfter?.();
  };

  const setQuery = (queryData: SetQueryProps[] | SetQueryProps) => {
    const queryParamsData = getQueryValues(queryParams);
    const queries: SetQueryProps[] = [
      ...queryParamsData,
      ...(Array.isArray(queryData) ? queryData : [queryData]),
    ];

    const mergedQueryString = mergeQueryParams(searchParams, queries);

    if (!debounce) {
      router.push(`${pathname}?${mergedQueryString}`);
      setControllers(queryParams);
      void onChange?.();
    }

    const newData = getQueryValuesNameKey(queries);
    setDebounceValue({ ...data, ...newData });
  };

  useEffect(() => {
    if (debounce && initialized.current) {
      const queryValue = getQueryValues(debouncedValue);
      const mergedQueryString = mergeQueryParams(searchParams, queryValue);

      router.replace(`${pathname}?${mergedQueryString}`);
      setControllers(debouncedValue);
      void onChange?.();
    }
    if (controllers) {
      let tempControllerData: Partial<Record<keyof T, string>> = {};
      Object.keys(controllers).forEach((key) => {
        const valuesKey = Object.keys(normalValue);
        const searchParam = Object.keys(queryParams ?? {}).find(
          (param) => param === key,
        );
        if (valuesKey.includes(key) && searchParam) {
          tempControllerData = {
            ...tempControllerData,
            [key]: queryParams[searchParam],
          };
        }
      });

      if (Object.keys(tempControllerData).length > 0) {
        setControllers(tempControllerData as T);
        onChange?.();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, debounce, pathname, router, searchParams]);

  return {
    setQuery,
    values: debounce ? normalValue : queryParams,
  };
};
