export function ClampNumber(num?: number, locale = "en-US") {
  if (!num) return;

  const formattedNum = new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);

  return formattedNum;
}
