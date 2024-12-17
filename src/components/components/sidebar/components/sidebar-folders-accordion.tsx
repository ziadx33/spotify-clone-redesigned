import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaRegFolderClosed } from "react-icons/fa6";
import { useFolders } from "@/hooks/use-folders";
import {
  type MouseEventHandler,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { SidebarSkeletonItem } from "./sidebar-skeleton-item";
import { SidebarFolderAccordion } from "./sidebar-folder-accordion";
import { FaPlus } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { AddFolderInput } from "./add-folder-input";

type SidebarFoldersAccordionProps = {
  setValue: Dispatch<SetStateAction<string[]>>;
};

export function SidebarFoldersAccordion({
  setValue,
}: SidebarFoldersAccordionProps) {
  const { data: folders } = useFolders();
  const skeletons = useMemo(() => {
    return (
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <SidebarSkeletonItem key={i} />
        ))}
      </div>
    );
  }, []);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const items = useMemo(() => {
    return folders?.map((folder) => {
      return <SidebarFolderAccordion key={folder.id} folder={folder} />;
    });
  }, [folders]);
  const onCreateFolderClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    const editingValue = !isEditing;
    setIsEditing(editingValue);
    if (editingValue) void setValue(["folders"]);
  };

  return (
    <AccordionItem value="folders" className="px-2">
      <AccordionTrigger>
        <div className="flex w-full items-center justify-between pr-2">
          <div className="flex items-center gap-2 text-xl">
            <FaRegFolderClosed size={18} />
            Folders
          </div>
          <button
            onClick={onCreateFolderClick}
            className={cn(
              "grid h-full w-8 place-items-center transition-all duration-300",
              isEditing ? "rotate-45" : "",
            )}
          >
            <FaPlus size={13} />
          </button>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {isEditing && <AddFolderInput setIsEditing={setIsEditing} />}
        {folders ? items : skeletons}
      </AccordionContent>
    </AccordionItem>
  );
}
