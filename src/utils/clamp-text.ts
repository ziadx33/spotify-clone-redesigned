export const clampText = (text: string, num = 20) => {
  return `${text.slice(0, num)}${text.length > num - 3 ? "..." : ""}`;
};
