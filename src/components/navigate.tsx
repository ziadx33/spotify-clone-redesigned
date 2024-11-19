import { type NavigateProps, useNavigate } from "@/hooks/use-navigate";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { MdOutlineBackupTable } from "react-icons/md";

type MenuItemProps = {
  icon: ReactNode;
  title: string;
  onClick: () => void;
};

export function Navigate({
  children,
  data,
  href,
  onClick,
  contextItems,
  ...restProps
}: NavigateProps & {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  onClick?: () => unknown | Promise<unknown>;
  image?: string;
  contextItems?: Partial<MenuItemProps>[];
} & Omit<ComponentPropsWithoutRef<"button">, "onClick">) {
  const navigate = useNavigate({ data, href });
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          onClick={async () => {
            await onClick?.();
            navigate();
          }}
          {...restProps}
        >
          {children}
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-48">
        <ContextMenuItem
          className="flex items-center gap-2"
          onClick={() => navigate.apply({}, [, , false])}
        >
          <span className="w-4">
            <MdOutlineBackupTable />
          </span>
          <span>Open in new tab</span>
        </ContextMenuItem>
        {contextItems?.map(({ icon, title, onClick }, index) => (
          <ContextMenuItem
            key={index}
            className="flex items-center gap-2"
            onClick={onClick}
          >
            <span className="w-4">{icon}</span>
            <span>{title}</span>
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}
