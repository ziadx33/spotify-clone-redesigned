import { toast } from "sonner";
import { type Track } from "@prisma/client";

export const downloadAudios = async (tracks: (Track | null | undefined)[]) => {
  if (!tracks.length) {
    toast.error("No audio tracks to download.");
    return;
  }

  for (const track of tracks) {
    toast.promise(
      (async () => {
        if (!track) {
          throw new Error("Track is undefined.");
        }
        const response = await fetch(track.trackSrc);
        if (!response.ok) {
          throw new Error(`Failed to download ${track.title}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${track.title || "audio"}.mp3`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })(),
      {
        loading: `Downloading ${track?.title}...`,
        success: `Downloaded ${track?.title} successfully!`,
        error: `Failed to download ${track?.title}.`,
      },
    );
  }
};
