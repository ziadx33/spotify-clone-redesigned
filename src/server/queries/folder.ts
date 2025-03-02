import { type Folder } from "@prisma/client";
import axios from "axios";

export async function getFolders(userId: string): Promise<Folder[] | null> {
  try {
    console.log("I hate axios");
    const { data: response } = await axios.get<{ data: Folder[] }>(
      `/api/folders?userId=${userId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching folders:", error);
    return null;
  }
}
