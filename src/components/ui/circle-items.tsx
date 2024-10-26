import { cn } from "@/lib/utils";
import { Fragment, type ReactNode } from "react";
import { FaCircle } from "react-icons/fa";

type CircleItemsProps = {
  items: ReactNode[];
  className?: string;
};

export function CircleItems({ items, className }: CircleItemsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-muted-foreground",
        className,
      )}
    >
      {items.map((el, index) => (
        <Fragment key={index}>
          {el}
          {index !== items.length - 1 && <FaCircle size={5} />}
        </Fragment>
      ))}
    </div>
  );
}
