import { type loginSchema } from "@/schemas";
import { type Dispatch, type SetStateAction } from "react";
import { type z } from "zod";

export const login = async (
  data: z.infer<typeof loginSchema>,
  setLoading: Dispatch<SetStateAction<boolean>>,
) => {
  setLoading(true);
  console.log(data);
  await new Promise((res) => setTimeout(res, 5000));
  setLoading(false);
};
