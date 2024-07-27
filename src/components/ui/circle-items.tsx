import { Fragment, type ReactNode } from "react";
import { FaCircle } from "react-icons/fa";

export function CircleItems({ items }: { items: ReactNode[] }) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      {items.map((el, index) => (
        <Fragment key={index}>
          {el}
          {index !== items.length - 1 && <FaCircle size={5} />}
        </Fragment>
      ))}
    </div>
  );
}
