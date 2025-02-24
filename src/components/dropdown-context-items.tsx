import { type DropdownMenuType } from "@/types";
import { useMemo, useState, type ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { type ContextMenuTriggerProps } from "@radix-ui/react-context-menu";

type ContextMenuItemsProps = {
  items: DropdownMenuType[];
  children?: ReactNode;
};

export function DropdownContextItems({
  items,
  children,
}: ContextMenuItemsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const isTouchDevice =
    typeof window !== "undefined" && "ontouchstart" in window;

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
  };

  const allContent = useMemo(() => {
    return items.flatMap((item, index) => [
      item.content && <div key={`content-${index}`}>{item.content}</div>,
      item.nestedMenu?.items.map(
        (nestedItem, nestedIndex) =>
          nestedItem.content && (
            <div key={`nested-content-${index}-${nestedIndex}`}>
              {nestedItem.content}
            </div>
          ),
      ),
    ]);
  }, [items]);

  return (
    <ContextMenu>
      <div
        onContextMenu={handleOpen}
        onClick={(e) => isTouchDevice && handleOpen(e)}
      >
        {children}
      </div>
      <ContextMenuContent
        className="mr-2 w-80"
        onInteractOutside={() => setMenuOpen(false)}
      >
        {items.map((item, index) =>
          item.nestedMenu ? (
            <ContextMenuSub key={`menu-${index}`}>
              <ContextMenuSubTrigger className="flex h-fit items-center gap-2 py-2">
                <div className="w-5">
                  <item.icon size={18} />
                </div>
                {item.title}
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-60">
                {item.nestedMenu.items.map((nestedItem, nestedIndex) => (
                  <ContextMenuItem
                    key={`nested-item-${index}-${nestedIndex}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      nestedItem.event && nestedItem.event(e);
                    }}
                    className="flex h-fit items-center gap-2 py-2"
                  >
                    <div className="w-5">
                      <nestedItem.icon size={18} />
                    </div>
                    {nestedItem.title}
                  </ContextMenuItem>
                ))}
              </ContextMenuSubContent>
            </ContextMenuSub>
          ) : (
            <ContextMenuItem
              key={`item-${index}`}
              onClick={(e) => {
                e.stopPropagation();
                item.event && item.event(e);
              }}
              className="flex h-fit items-center gap-2 py-2"
            >
              <div className="w-5">
                <item.icon size={18} />
              </div>
              {item.title}
            </ContextMenuItem>
          ),
        )}
      </ContextMenuContent>
      {allContent}
    </ContextMenu>
  );
}

const Trigger = (props: ContextMenuTriggerProps) => {
  return <ContextMenuTrigger {...props} />;
};

DropdownContextItems.Trigger = Trigger;
