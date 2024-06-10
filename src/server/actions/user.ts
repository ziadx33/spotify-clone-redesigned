"use server";

import { db } from "../db";

export async function getUserByEmail(email: string) {
  try {
    // const user = await db.user.findUnique()
  } catch (err) {
    throw { error: err };
  }
}
