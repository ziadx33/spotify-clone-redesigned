import { type ReactNode } from "react";

export function PlaylistsSectionContainer({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="w-full rounded-lg border-2 border-transparent px-3 transition-all">
      {children}
    </div>
  );
}
