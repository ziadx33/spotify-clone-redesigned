"use client";

import Loading from "@/components/ui/loading";
import { useSession } from "@/hooks/use-session";
import { type User } from "@prisma/client";
import { redirect, useParams } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";

type UserRouteProps = {
  children: ((user: User) => ReactNode) | ReactNode;
};

export default function UserRoute({ children }: UserRouteProps) {
  const params = useParams();
  const userId = params.userId;
  const { data: user } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const isDone = useRef(false);
  useEffect(() => {
    if (isDone.current) return;
    if (userId !== user?.user?.id) redirect("/");
    else {
      setIsLoading(false);
    }
    isDone.current = true;
  }, [user?.user?.id, userId]);

  return !isLoading && user?.user ? (
    typeof children === "function" ? (
      children(user.user)
    ) : (
      children
    )
  ) : (
    <Loading />
  );
}
