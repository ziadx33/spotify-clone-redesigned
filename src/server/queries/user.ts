import { type $Enums, type User } from "@prisma/client";
import { baseAPI } from "../api";

export async function getUser({
  email,
  id,
}: {
  email?: string;
  id?: string;
}): Promise<User | null> {
  try {
    const response = await baseAPI.get<User>(
      `/api/users/${id ?? email}?type=${id ? "id" : "email"}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function getUserByIds({
  ids,
}: {
  ids?: string[];
}): Promise<User[] | null> {
  try {
    const response = await baseAPI.get<User[]>(
      `/api/users?ids=${ids?.join(",")}`,
    );
    return response.data ?? [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
}

export async function getUserFollowing({
  id,
  userType,
}: {
  id?: string;
  userType?: $Enums.USER_TYPE;
}): Promise<User[] | null> {
  try {
    const response = await baseAPI.get<User[]>(
      `/api/users/${id}/following${userType ? `?userType=${userType}` : ""}`,
    );
    return response.data ?? [];
  } catch (error) {
    console.error("Error fetching following users:", error);
    return null;
  }
}

type GetPopularUsersParams = {
  genre?: $Enums.GENRES;
  range?: {
    from?: number;
    to?: number;
  };
  userType?: $Enums.USER_TYPE;
  orderBy?: "asc" | "desc";
};

export const getPopularUsers = async ({
  range,
  genre,
  userType,
  orderBy,
}: GetPopularUsersParams) => {
  try {
    const params = new URLSearchParams();

    if (orderBy) params.append("orderBy", orderBy);
    if (range?.from) params.append("from", range.from.toString());
    if (range?.to) params.append("to", range?.to.toString());
    if (userType) params.append("userType", userType);
    if (genre) params.append("genre", genre);

    const response = await baseAPI.get<User[]>(
      `/users/followers?${params.toString()}`,
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching popular users:", error);
    return null;
  }
};

type GetUsersBySearchQueryParams = {
  query: string;
  amount?: number;
  type?: $Enums.USER_TYPE;
  restartLength?: number;
};

export const getUsersBySearchQuery = async ({
  query,
  amount,
  type,
  restartLength,
}: GetUsersBySearchQueryParams) => {
  try {
    const params = new URLSearchParams();

    if (query) params.append("query", query);
    if (amount) params.append("amount", amount.toString());
    if (type) params.append("type", type);
    if (restartLength) params.append("userType", restartLength.toString());

    const response = await baseAPI.get<User[]>(
      `/users/search?${params.toString()}`,
    );

    return response.data;
  } catch (error) {
    console.error("Error searching users:", error);
    return null;
  }
};
