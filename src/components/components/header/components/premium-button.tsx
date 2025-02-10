"use client";

import { Button } from "@/components/ui/button";
import { useUserData } from "@/hooks/use-user-data";

export function PremiumButton() {
  const user = useUserData();
  return !user?.isPremium ? <Comp /> : null;
}

function Comp() {
  return <Button variant="secondary">Requests</Button>;
}
