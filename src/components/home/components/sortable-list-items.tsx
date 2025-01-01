import { useMemo } from "react";
import {
  type GetItemsType,
  SortableItems,
  type SortEndType,
} from "./sortable-list";

type PinnedListProps = {
  getItems: GetItemsType;
  sortEnd: SortEndType;
  items: string[] | undefined;
  fallback?: string[];
  filter?: (item: ReturnType<GetItemsType>[0]) => boolean;
};

export function SortableListItems({
  getItems,
  sortEnd,
  items,
  fallback,
  filter,
}: PinnedListProps) {
  const itemsSections = useMemo(() => {
    return getItems(items, false);
  }, [items, getItems]);

  const filteredItems = useMemo(() => {
    return filter ? itemsSections.filter(filter) : itemsSections;
  }, [itemsSections, filter]);

  return (
    <SortableItems
      items={filteredItems}
      helperClass="z-50 bg-muted"
      onSortEnd={(params) =>
        sortEnd(params, items ?? fallback, "pinnedHomeSections")
      }
      lockAxis="y"
      lockToContainerEdges
    />
  );
}
