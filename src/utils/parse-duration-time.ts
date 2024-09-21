export const parseDurationTime = (duration?: number) => {
  return String(
    (Math.floor((duration ?? 0) / 60) + ((duration ?? 0) % 60) / 100).toFixed(
      2,
    ),
  ).replace(".", ":");
};
