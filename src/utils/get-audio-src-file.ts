export async function getAudioSrcFile(src: string, title: string) {
  const response = await fetch(src);
  if (!response.ok) {
    throw new Error("Failed to fetch audio file");
  }
  const blob = await response.blob();
  const file = new File([blob], title, {
    type: blob.type,
  });
  return file;
}
