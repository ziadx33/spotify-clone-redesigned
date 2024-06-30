"use server";

import { revalidatePath } from "next/cache";

export const revalidate = (text: string) => {
  revalidatePath(text);
};
