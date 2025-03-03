import { type VerificationToken } from "@prisma/client";
import axios from "axios";

export async function getVerificationTokenById(
  tokenId: string,
): Promise<VerificationToken | null> {
  try {
    const response = await axios.get<VerificationToken>(
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
    const response = await axios.get<VerificationToken>(
      `/api/verification-tokens?email=${email}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching verification token:", error);
    return null;
  }
}
