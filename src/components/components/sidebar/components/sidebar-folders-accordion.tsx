import { SidebarItemAccordion } from "./sidebar-item-accordion";
import { FaRegFolderClosed } from "react-icons/fa6";
import { useFolders } from "@/hooks/use-folders";
import { useMemo, useState, type RefObject } from "react";
import { SidebarSkeletonItem } from "./sidebar-skeleton-item";
import { SidebarFolderAccordion } from "./sidebar-folder-accordion";
import { AddFolderInput } from "./edit-input";
import { useUserData } from "@/hooks/use-user-data";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/state/store";
import { toast } from "sonner";
import { addFolder, editFolder } from "@/state/slices/folders";
import { createFolder } from "@/server/actions/folder";

export function SidebarFoldersAccordion() {
  const { data: folders } = useFolders();
  const dispatch = useDispatch<AppDispatch>();
  const userData = useUserData();
  const [isEditing, setIsEditing] = useState(false);

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

  const enterHandler = async (inputRef: RefObject<HTMLInputElement>) => {
    const inputValue = inputRef.current?.value;
    if (!inputValue || inputValue.length === 0) {
      return toast.error("Please enter a valid folder name.");
    }

    setIsEditing(false);
    const tempFolderName = `last-created-${crypto.randomUUID()}`;
    dispatch(
      addFolder({
        id: tempFolderName,
        name: inputValue,
        playlistIds: [],
        userId: userData.id,
      }),
    );

    const createdFolder = await createFolder(inputValue, userData.id);
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
      customCreateUI={
        isEditing && <AddFolderInput enterHandler={enterHandler} />
      }
      onCreate={() => setIsEditing((prev) => !prev)}
      isLoading={!folders}
      loadingPlaceholder={skeletons}
    />
  );
}
