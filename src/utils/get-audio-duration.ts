export async function getAudioDuration(file: File | Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const fileURL = URL.createObjectURL(file);

    audio.src = fileURL;

    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(fileURL);
      resolve(Math.floor(audio.duration));
    };

    audio.onerror = () => {
      URL.revokeObjectURL(fileURL);
      reject(new Error("Failed to load audio file for duration calculation"));
    };
  });
}
