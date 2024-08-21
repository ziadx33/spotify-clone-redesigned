export const getAvatarFallback = (text?: string) => {
  return text
    ?.split(" ")
    .slice(0, 2)
    .map((element) => element[0])
    .join("");
};
