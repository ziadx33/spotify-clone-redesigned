"use client";

import Loading from "@/components/ui/loading";
import { useUserData } from "@/hooks/use-user-data";
import { type User } from "@prisma/client";
import { redirect, useParams } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";

type UserRouteProps = {
  children: ((user: User) => ReactNode) | ReactNode;
};

export default function UserRoute({ children }: UserRouteProps) {
  const params = useParams();
  const userId = params.userId;
  const user = useUserData();
  const [isLoading, setIsLoading] = useState(false);
  const isDone = useRef(false);
  useEffect(() => {
    if (isDone.current) return;
    if (userId !== user?.id) redirect("/");
    else {
      setIsLoading(false);
    }
    isDone.current = true;
  }, [user?.id, userId]);

  return !isLoading && user ? (
    typeof children === "function" ? (
      children(user)
    ) : (
      children
    )
  ) : (
    <Loading />
  );
}
