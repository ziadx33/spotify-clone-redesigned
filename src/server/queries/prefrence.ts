import { type Preference } from "@prisma/client";
import { baseAPI } from "../api";
import { type PrefrenceSliceType } from "@/state/slices/prefrence";

export const getPrefrence = async (
  userId: string,
): Promise<PrefrenceSliceType> => {
  try {
    const { data: prefrence } = await baseAPI.get<Preference | null>(
      `/api/prefrences/${userId}`,
    );
    if (!prefrence) throw "no prefrence";
    return {
      data: prefrence,
      error: null,
      status: "success",
    };
  } catch (error) {
    console.error("Error fetching prefrence:", error);
    return {
      data: null,
      error: error as string,
      status: "error",
    };
  }
};
