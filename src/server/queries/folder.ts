import { type Folder } from "@prisma/client";
import axios from "axios";

export async function getFolders(userId: string): Promise<Folder[] | null> {
  try {
    const response = await axios.get<Folder[]>(`/api/folders?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching folders:", error);
    return null;
  }
}
