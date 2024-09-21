export type SliceType<T> =
  | { status: "loading"; data: null; error: null }
  | {
      status: "success";
      data: T;
      error: null;
    }
  | { status: "error"; data: null; error: string };
