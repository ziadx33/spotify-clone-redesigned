import { type VerificationToken } from "@prisma/client";
import { baseAPI } from "../api";

export async function getVerificationTokenById(
  tokenId: string,
): Promise<VerificationToken | null> {
  try {
    const response = await baseAPI.get<VerificationToken>(
      `/api/verification-tokens?token=${tokenId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching verification token:", error);
    return null;
  }
}

export async function getVerificationTokenByEmail(
  email: string,
): Promise<VerificationToken | null> {
  try {
    const response = await baseAPI.get<VerificationToken>(
      `/api/verification-tokens?email=${email}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching verification token:", error);
    return null;
  }
}
