"use client";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verifyToken } from "@/server/actions/verification-token";
import { useTheme } from "next-themes";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";

export function VerificationToken({ token }: { token: string | null }) {
  const theme = useTheme();
  const router = useRouter();
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;

    if (!token) notFound();
    const verifyAsyncEffect = async () => {
      const { error } = await verifyToken(token);
      if (error) return toast.error(error);
      router.push("/login");
    };
    void verifyAsyncEffect();
    isMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <CardHeader>
        <CardTitle>Verifying your account...</CardTitle>
        <CardDescription>it might take sometime...</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <BeatLoader
          color={theme?.resolvedTheme === "dark" ? "white" : "black"}
        />
      </CardContent>
    </>
  );
}
