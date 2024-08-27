export const getRandomValue = (array: string[]) => {
  return array[Math.floor(Math.random() * array.length)]!;
};
