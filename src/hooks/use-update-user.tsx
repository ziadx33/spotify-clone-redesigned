import { type User } from "@prisma/client";
import { useSession } from "./use-session";
import { updateUserById } from "@/server/actions/user";

export function useUpdateUser() {
  const { update: updateSession, data: user } = useSession();
  const update = async ({ data }: { data: Partial<User> }) => {
    void updateSession(data);
    if (!user?.user?.id) return;
    await updateUserById({
      id: user?.user?.id,
      data: data,
    });
  };
  return { update };
}
