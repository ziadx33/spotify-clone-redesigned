import { type User } from "@prisma/client";
import { useSession } from "./use-session";
import { updateUserById } from "@/server/actions/user";

export function useUpdateUser() {
  const { update: updateSession, data: user } = useSession();
  const update = async (
    updateData:
      | { data: Partial<User> }
      | ((user: User | undefined) => { data: Partial<User> }),
  ) => {
    let data: { data: Partial<User> };
    if (typeof updateData === "function") {
      data = updateData(user?.user);
    } else data = updateData;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    void updateSession(data.data);
    if (!user?.user?.id) return;
    await updateUserById({
      id: user?.user?.id,
      data: data.data,
    });
  };
  return { update };
}
