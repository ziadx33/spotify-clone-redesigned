import { type Notification } from "@prisma/client";
import { baseAPI } from "../api";

export async function getNotifications(
  userId: string,
): Promise<Notification[] | null> {
  try {
    const response = await baseAPI.get<Notification[]>(
      `/api/notifications?userId=${userId}`,
    );
    console.log("naar", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return null;
  }
}
