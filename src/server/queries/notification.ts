import { type Notification } from "@prisma/client";
import axios from "axios";

export async function getNotifications(
  userId: string,
): Promise<Notification[] | null> {
  try {
    const response = await axios.get<Notification[]>(
      `/api/notifications?userId=${userId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching folders:", error);
    return null;
  }
}
