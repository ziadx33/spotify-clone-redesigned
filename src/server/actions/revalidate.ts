"use server";

import { revalidatePath } from "next/cache";

export const revalidate = async (text: string) => {
  revalidatePath(text);
};
