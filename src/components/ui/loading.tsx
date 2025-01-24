import { cn } from "@/lib/utils";
import { RotatingLines } from "react-loader-spinner";

type LoadingProps = {
  className?: string;
  width?: string;
};

export default function Loading({ className, width = "70" }: LoadingProps) {
  return (
    <div
      className={cn(
        "absolute grid h-screen w-full place-items-center",
        className,
      )}
    >
      <RotatingLines
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        width={width}
        visible={true}
      />
    </div>
  );
}
