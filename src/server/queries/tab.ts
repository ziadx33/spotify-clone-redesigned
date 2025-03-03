import { type Tab } from "@prisma/client";
import { baseAPI } from "../api";
import { type TabsSliceType } from "@/state/slices/tabs";

export async function getTabs({
  email,
  userId,
}: {
  email?: string;
  userId?: string;
}): Promise<TabsSliceType> {
  try {
    const response = await baseAPI.get<Tab[]>(
      `/api/tabs/${userId ?? email}?type=${userId ? "id" : "email"}`,
    );
    return {
      data: response.data,
      status: "success",
      error: null,
    };
  } catch (error) {
    console.error("Error fetching tabs:", error);
    return {
      status: "error",
      error: (error as { message: string }).message,
      data: null,
    };
  }
}
