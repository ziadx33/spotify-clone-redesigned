import { FaRegFolderClosed } from "react-icons/fa6";
import { SidebarItem } from "./sidebar-item";
import { Input } from "@/components/ui/input";
import { useRef, type Dispatch, type SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/state/store";
import { addFolder, editFolder } from "@/state/slices/folders";
import { toast } from "sonner";
import { useUserData } from "@/hooks/use-user-data";
import { createFolder } from "@/server/actions/folder";
import { revalidate } from "@/server/actions/revalidate";

type AddFolderInputProps = {
  setIsEditing: Dispatch<SetStateAction<boolean>>;
};

export function AddFolderInput({ setIsEditing }: AddFolderInputProps) {
  const dispatch = useDispatch<AppDispatch>();
  const inputRef = useRef<HTMLInputElement>(null);
  const userData = useUserData();
  const enterHandler = async () => {
    const inputValue = inputRef.current?.value;
    if (!inputValue || inputValue.length === 0)
      return toast.error("please enter a valid folder name.");
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
    revalidate("/");
    dispatch(editFolder({ id: tempFolderName, data: createdFolder }));
  };
  return (
    <SidebarItem variant="secondary">
      <div className="flex items-center gap-2 text-sm">
        <FaRegFolderClosed size={18} />
        <Input
          ref={inputRef}
          onKeyDown={(e) => e.key === "Enter" && enterHandler()}
          autoFocus
          className="h-6 border-none bg-transparent pl-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
        />
      </div>
    </SidebarItem>
  );
}
