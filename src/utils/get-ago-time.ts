import { intervalToDuration } from "date-fns";

export const getAgoTime = (date: Date) => {
  const { seconds, minutes, hours, days, months, years } = intervalToDuration({
    start: date,
    end: new Date(),
  });

  const isSecond = !!seconds ? seconds : 0;
  const isMinutes = !!minutes ? minutes : 0;
  const isHours = !!hours ? hours : 0;
  const isDays = !!days ? days : 0;
  const isWeek = Math.floor(isDays / 7);
  const isDayRemainder = isDays % 7;
  const isMonth = !!months ? months : 0;
  const isYear = !!years ? years : 0;

  return isSecond > 60 || isMinutes >= 1
    ? isMinutes > 60 || isHours >= 1
      ? isHours > 60 || isDays >= 1
        ? isDays > 6 || isWeek >= 1
          ? isWeek > 29 || isMonth >= 1
            ? isMonth > 11 || isYear >= 1
              ? `${isYear}y ago`
              : `${isMonth}m ago`
            : `${isWeek}w ago`
          : `${isDayRemainder}d ago`
        : `${isHours}h ago`
      : `${isMinutes}m ago`
    : `${isSecond}s ago`;
};
