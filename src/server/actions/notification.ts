"use server";

import { db } from "../db";

export const getNotificationsByUserId = async (userId: string) => {
  try {
    const notifications = await db.notification.findMany({
      where: {
        artist: {
          followers: {
            has: userId,
          },
        },
      },
    });
    return notifications;
  } catch (error) {
    throw { error };
  }
};
