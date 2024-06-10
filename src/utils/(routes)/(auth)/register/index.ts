import { type registerSchema } from "@/schemas";
import { type Dispatch, type SetStateAction } from "react";
import { type z } from "zod";

export const register = async (
  data: z.infer<typeof registerSchema> & { origin: string },
  setLoading: Dispatch<SetStateAction<boolean>>,
) => {
  setLoading(true);

  setLoading(false);
};
