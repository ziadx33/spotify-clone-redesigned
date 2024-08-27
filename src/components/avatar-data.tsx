import { useMemo, type ComponentPropsWithoutRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getAvatarFallback } from "@/utils/get-avatar-fallback";

type AvatarData = {
  title?: string | null;
  containerClasses?: string;
} & ComponentPropsWithoutRef<"img">;

export function AvatarData({
  containerClasses,
  title,
  ...restProps
}: AvatarData) {
  const fallback = useMemo(() => {
    return getAvatarFallback(title);
  }, [title]);
  return (
    <Avatar className={containerClasses}>
      <AvatarImage {...restProps} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
