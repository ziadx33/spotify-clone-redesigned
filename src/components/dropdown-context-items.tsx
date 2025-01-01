import { type DropdownMenuType } from "@/types";
import { useMemo, type ReactNode } from "react";
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
  const allContent = useMemo(() => {
    const content: ReactNode[] = [];

    items.forEach((item, index) => {
      if (item.content) {
        content.push(<div key={`content-${index}`}>{item.content}</div>);
      }
      if (item.nestedMenu) {
        item.nestedMenu.items.forEach((nestedItem, nestedIndex) => {
          if (nestedItem.content) {
            content.push(
              <div key={`nested-content-${index}-${nestedIndex}`}>
                {nestedItem.content}
              </div>,
            );
          }
        });
      }
    });
    return content;
  }, [items]);

  return (
    <>
      <ContextMenu>
        {children}
        <ContextMenuContent className="mr-2 w-80">
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
      </ContextMenu>

      {allContent}
    </>
  );
}

const Trigger = (props: ContextMenuTriggerProps) => {
  return <ContextMenuTrigger {...props} />;
};

DropdownContextItems.Trigger = Trigger;
