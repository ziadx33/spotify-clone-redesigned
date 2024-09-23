import { supabase } from "../supabase";

type UploadBucketFileProps = {
  file: File;
  id: string;
  currentImageURL: string;
};

export const uploadPlaylistPic = async ({
  file,
  id,
  currentImageURL,
}: UploadBucketFileProps) => {
  try {
    const state = currentImageURL.endsWith("no-image-src-album")
      ? "upload"
      : "update";
    const uploadedImage = await supabase.storage
      .from("images")
      [state](id, file);
    return uploadedImage.data?.path;
  } catch (error) {
    throw { error };
  }
};
