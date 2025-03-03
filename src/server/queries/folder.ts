import { type Folder } from "@prisma/client";
import { baseAPI } from "../api";

export async function getFolders(userId: string): Promise<Folder[] | null> {
  try {
    const response = await baseAPI.get<Folder[]>(
      `/api/folders?userId=${userId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching folders:", error);
    return null;
  }
}
