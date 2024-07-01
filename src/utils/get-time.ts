const times = ["s", "min", "hr"];

export const getTime = (time: number, index = 0): string => {
  if (index >= times.length || time === 0) return "";

  const value = index === 0 ? time % 60 : Math.floor(time % 60);
  const unitString = value > 0 ? `${value} ${times[index]}` : "";

  const nextResult = getTime(Math.floor(time / 60), index + 1).trim();

  return nextResult ? `${nextResult} ${unitString}` : unitString.trim();
};
