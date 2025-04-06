import { UTApi, UTFile } from "uploadthing/server";

const utapi = new UTApi();

export const uploadAudioFile = async (file: File, id: string) => {
  const fileData = new UTFile([file], `${id}.mp3`, { customId: id });
  return (await utapi.uploadFiles([fileData]))[0]?.data;
};

export const deleteAudioFile = async (fileURL: string) => {
  return await utapi.deleteFiles(fileURL, { keyType: "customId" });
};
