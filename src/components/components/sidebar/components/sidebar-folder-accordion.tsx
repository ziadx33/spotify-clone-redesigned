import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaRegFolderClosed } from "react-icons/fa6";
import { FolderPlaylists } from "./folder-playlists";
import { type Folder } from "@prisma/client";
import { FaTrash } from "react-icons/fa";
import { deleteFolder } from "@/server/actions/folder";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/state/store";
import { removeFolder } from "@/state/slices/folders";
import { useUserData } from "@/hooks/use-user-data";

export function SidebarFolderAccordion({ folder }: { folder: Folder }) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useUserData();
  const deleteHandler = async () => {
    dispatch(removeFolder(folder.id));
    await deleteFolder(folder.id, user.id);
  };
  return (
    <Accordion type="multiple" className="w-full" key={folder.id}>
      <AccordionItem value={folder.id}>
        <AccordionTrigger className="px-1.5">
          <div className="flex w-full items-center justify-between pr-2">
            <div className="flex items-center gap-2 text-sm">
              <FaRegFolderClosed size={18} />
              {folder.name}
            </div>
            <button
              onClick={deleteHandler}
              className="grid h-full w-8 place-items-center"
            >
              <FaTrash size={13} />
            </button>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <FolderPlaylists folder={folder} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
