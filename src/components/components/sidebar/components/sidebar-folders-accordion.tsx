import { SidebarItemAccordion } from "./sidebar-item-accordion";
import { FaRegFolderClosed } from "react-icons/fa6";
import { useFolders } from "@/hooks/use-folders";
import { useMemo } from "react";
import { SidebarSkeletonItem } from "./sidebar-skeleton-item";
import { SidebarFolderAccordion } from "./sidebar-folder-accordion";
import { useUserData } from "@/hooks/use-user-data";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/state/store";
import { toast } from "sonner";
import { addFolder, editFolder } from "@/state/slices/folders";
import { createFolder } from "@/server/actions/folder";
import { Input } from "@/components/ui/input";
import { SidebarItem } from "./sidebar-item";

export function SidebarFoldersAccordion() {
  const { data: folders } = useFolders();
  const dispatch = useDispatch<AppDispatch>();
  const userData = useUserData();

  const skeletons = useMemo(
    () => (
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <SidebarSkeletonItem key={i} />
        ))}
      </div>
    ),
    [],
  );

  const enterHandler = async (value: string) => {
    if (!value || value.length === 0) {
      return toast.error("Please enter a valid folder name.");
    }

    const tempFolderName = `last-created-${crypto.randomUUID()}`;
    dispatch(
      addFolder({
        id: tempFolderName,
        name: value,
        playlistIds: [],
        userId: userData.id,
      }),
    );

    const createdFolder = await createFolder(value, userData.id);
    dispatch(editFolder({ id: tempFolderName, data: createdFolder }));
  };

  return (
    <SidebarItemAccordion
      title="Folders"
      icon={<FaRegFolderClosed size={18} />}
      items={folders ?? []}
      filterKey="name"
      renderItem={(folder) => (
        <SidebarFolderAccordion key={folder.id} folder={folder} />
      )}
      customCreateUI={(onCreate) => (
        <SidebarItem key={"creating"}>
          <div className="flex">
            <FaRegFolderClosed size={18} />
            <Input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onCreate(e, e.currentTarget.value);
                }
              }}
              placeholder="enter folder name..."
              className="h-5 border-none bg-transparent pl-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </SidebarItem>
      )}
      onCreate={enterHandler}
      isLoading={!folders}
      loadingPlaceholder={skeletons}
    />
  );
}
