import { FaRegFolderClosed } from "react-icons/fa6";
import { SidebarItem } from "./sidebar-item";
import { Input } from "@/components/ui/input";
import {
  type KeyboardEvent,
  useRef,
  type RefObject,
  useTransition,
} from "react";
import { toast } from "sonner";

type AddFolderInputProps = {
  enterHandler: (inputRef: RefObject<HTMLInputElement>) => Promise<unknown>;
};

export function AddFolderInput({ enterHandler }: AddFolderInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const keyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputRef.current?.value.trim() === "")
        return toast.error("please enter a valid name.");
      startTransition(async () => {
        await enterHandler(inputRef);
      });
    }
  };
  return (
    <SidebarItem variant="secondary">
      <div className="flex items-center gap-2 text-sm">
        <FaRegFolderClosed size={18} />
        <Input
          disabled={pending}
          ref={inputRef}
          onKeyDown={keyDownHandler}
          autoFocus
          className="h-6 border-none bg-transparent pl-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
        />
      </div>
    </SidebarItem>
  );
}
