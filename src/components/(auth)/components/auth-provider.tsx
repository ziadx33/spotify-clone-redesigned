import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type AuthProviderProps = {
  children: ReactNode;
} & ButtonProps;

export function AuthProvider({ children, ...restProps }: AuthProviderProps) {
  return (
    <Button
      {...restProps}
      type="button"
      className={cn("h-full w-full border", restProps.className)}
      variant={"ghost" ?? restProps.variant}
    >
      {children}
    </Button>
  );
}
