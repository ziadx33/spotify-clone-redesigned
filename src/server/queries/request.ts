import { type Request } from "@prisma/client";
import { baseAPI } from "../api";

export async function getRequests(userId: string): Promise<Request[] | null> {
  try {
    const response = await baseAPI.get<Request[]>(
      `/api/requests?userId=${userId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching requests:", error);
    return null;
  }
}
