import { supabase } from "../supabase";

type UploadBucketFileProps = {
  file: File;
  id: string;
};

export const uploadPlaylistPic = async ({
  file,
  id,
}: UploadBucketFileProps) => {
  try {
    await supabase.storage.from("images").remove([id]);
    const uploadedImage = await supabase.storage
      .from("images")
      .upload(id, file);
    return uploadedImage.data?.path;
  } catch (error) {
    throw { error };
  }
};
