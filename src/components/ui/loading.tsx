import { cn } from "@/lib/utils";
import { RotatingLines } from "react-loader-spinner";

export default function Loading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute grid h-full w-full place-items-center",
        className,
      )}
    >
      <RotatingLines
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        width="70"
        visible={true}
      />
    </div>
  );
}
