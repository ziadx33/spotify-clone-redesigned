import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { type MutableRefObject, useCallback, useEffect } from "react";
import { useDebounceState } from "./use-debounce-state";

type UseSearchParams<T extends Record<string, string>> = {
  data: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
  onChange?: () => any | Promise<any>;
  debounce?: boolean;
  controllers?: Record<keyof T, MutableRefObject<null | string>>;
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
  const queryParams = Object.fromEntries(searchParams) as unknown as T &
    Record<string, string>;
  const [normalValue, setDebounceValue, debouncedValue] =
    useDebounceState(queryParams);

  type SetQueryProps = { name: keyof T; value: string };

  const createQueryString = useCallback(
    (data: SetQueryProps[]) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const item of data) {
        params.set(String(item.name), item.value);
      }
      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    const values = Object.keys(data).map((value) => ({
      name: value,
      value: data[value] ?? "",
    }));
    router.push(`${pathname}?${createQueryString(values)}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setControllers = (controllerData: T) => {
    if (!controllers) return; // Exit early if controllers is undefined

    Object.keys(controllers).forEach((controller) => {
      const currentController = controllers[controller];
      if (!currentController) return;
      currentController.current = controllerData[controller] ?? null;
    });
  };

  const setQuery = (queryData: SetQueryProps[] | SetQueryProps) => {
    if (!debounce) {
      router.push(
        `${pathname}?${createQueryString(queryData instanceof Array ? queryData : [queryData])}`,
      );
      setControllers(queryParams);
      void onChange?.();
    }
    const newData =
      queryData instanceof Array
        ? queryData.map((data) => ({ [data.name]: data.value }))
        : { [queryData.name]: queryData.value };
    setDebounceValue({ ...data, ...newData });
  };

  useEffect(() => {
    if (!debounce) return;
    const queryValue = Object.keys(debouncedValue).map((value) => ({
      name: value,
      value: debouncedValue[value] ?? "",
    }));
    router.push(`${pathname}?${createQueryString(queryValue)}`);
    setControllers(debouncedValue);
    void onChange?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return {
    setQuery,
    values: debounce ? normalValue : queryParams,
  };
};
