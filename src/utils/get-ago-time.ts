import { intervalToDuration } from "date-fns";

export const getAgoTime = (date: Date) => {
  const { seconds, minutes, hours, days, weeks, months, years } =
    intervalToDuration({
      start: date,
      end: new Date(),
    });
  const isSecond = !!seconds ? seconds : 0;
  const isMinutes = !!minutes ? minutes : 0;
  const isHours = !!hours ? hours : 0;
  const isDays = !!days ? days : 0;
  const isWeek = !!weeks ? weeks : 0;
  const isMonth = !!months ? months : 0;
  const isYear = !!years ? years : 0;
  return isSecond > 60 || isMinutes >= 1
    ? isMinutes > 60 || isHours >= 1
      ? isHours > 60 || isDays >= 1
        ? isDays > 6 || isWeek >= 1
          ? isWeek > 29 || isMonth >= 1
            ? isMonth > 11 || isYear >= 1
              ? `${years}y ago`
              : `${months}y ago`
            : `${weeks}w ago`
          : `${days}d ago`
        : `${hours}h ago`
      : `${minutes}m ago`
    : `${seconds}s ago`;
};
