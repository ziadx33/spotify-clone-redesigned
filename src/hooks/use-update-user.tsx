import { type User } from "@prisma/client";
import { updateUserById } from "@/server/actions/user";
import { revalidate } from "@/server/actions/revalidate";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/state/store";
import { useUserData } from "./use-user-data";
import { editUserData } from "@/state/slices/user";

export function useUpdateUser() {
  const user = useUserData();
  const dispatch = useDispatch<AppDispatch>();
  const update = async (
    updateData:
      | { data: Partial<User> }
      | ((user: User | undefined) => { data: Partial<User> }),
  ) => {
    let data: { data: Partial<User> };
    if (typeof updateData === "function") {
      data = updateData(user);
    } else data = updateData;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    dispatch(editUserData(data.data));
    if (!user?.id) return;
    await updateUserById({
      id: user?.id,
      data: data.data,
    });
    revalidate(`/artist/${user.id}`);
  };
  return { update, user };
}
