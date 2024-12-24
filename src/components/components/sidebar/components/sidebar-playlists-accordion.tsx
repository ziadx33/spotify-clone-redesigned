import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePlaylists } from "@/hooks/use-playlists";
import { RiFolderMusicLine } from "react-icons/ri";
import { useUserData } from "@/hooks/use-user-data";
import {
  type MouseEventHandler,
  useState,
  type SetStateAction,
  type Dispatch,
  type RefObject,
} from "react";
import { AddFolderInput } from "./edit-input";
import { cn } from "@/lib/utils";
import { FaPlus } from "react-icons/fa";
import { SidebarPlaylistAccordion } from "./sidebar-playlist-accordion";

type SidebarPlaylistsAccordionProps = {
  setValue: Dispatch<SetStateAction<string[]>>;
};

export function SidebarPlaylistsAccordion({
  setValue,
}: SidebarPlaylistsAccordionProps) {
  const user = useUserData();
  const { data } = usePlaylists();
  const playlists = data?.data?.filter(
    (playlist) => playlist.creatorId === user?.id,
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { createUserPlaylist } = usePlaylists();
  const onCreateFolderClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    const editingValue = !isEditing;
    setIsEditing(editingValue);
    if (editingValue) void setValue((v) => [...v, "playlists"]);
  };
  const enterHandler = async (inputRef: RefObject<HTMLInputElement>) => {
    await createUserPlaylist({
      title: inputRef.current?.value ?? "",
      creatorId: user?.id ?? "",
      description: "",
    });
    setIsEditing(false);
  };
  return (
    <AccordionItem value="playlists" className="px-2">
      <AccordionTrigger>
        <div className="flex w-full items-center justify-between pr-2">
          <div className="flex items-center gap-2 text-xl">
            <RiFolderMusicLine size={18} />
            Playlists
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
        {isEditing && <AddFolderInput enterHandler={enterHandler} />}
        {playlists?.map((playlist) => {
          return (
            <SidebarPlaylistAccordion key={playlist.id} playlist={playlist} />
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
}
