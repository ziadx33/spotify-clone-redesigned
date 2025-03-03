import { type Notification } from "@prisma/client";
import axios from "axios";

export async function getNotifications(
  userId: string,
): Promise<Notification[] | null> {
  try {
    const response = await axios.get<Notification[]>(
      `/api/notifications?userId=${userId}`,
    );
    console.log("naar", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return null;
  }
}
