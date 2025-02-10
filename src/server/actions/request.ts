"use server";

import { db } from "../db";

export const sendFeatRequests = async (
  data: NonNullable<Parameters<typeof db.request.createMany>["0"]>["data"],
) => {
  try {
    const createdRequests = await db.request.createMany({ data });
    return createdRequests;
  } catch (error) {
    throw { error };
  }
};

export const deleteRequest = async (data: string) => {
  try {
    const deletedRequest = await db.request.delete({ where: { id: data } });
    return deletedRequest;
  } catch (error) {
    throw { error };
  }
};

export const getFeatRequests = async (data: { userId: string }) => {
  try {
    const requests = await db.request.findMany({
      where: {
        AND: [
          {
            requestedUserIds: {
              has: data.userId,
            },
          },
          {
            requesterId: {
              not: data.userId,
            },
          },
        ],
      },
    });
    return requests;
  } catch (error) {
    throw { error };
  }
};
