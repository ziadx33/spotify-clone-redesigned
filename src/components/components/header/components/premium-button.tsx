"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";

export function PremiumButton() {
  const { data: user } = useSession();
  return !user?.user?.isPremium ? <Comp /> : null;
}

function Comp() {
  return <Button variant="secondary">Explore Premium</Button>;
}
