import { AudiosContext } from "@/providers/audios-provider";
import { useContext } from "react";

export function useAudios() {
  const context = useContext(AudiosContext);
  return context;
}
