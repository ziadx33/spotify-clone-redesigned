export function shuffleArray<T>(arr: T[], from?: T): T[] {
  let returnArray: T[] = [...arr];
  const shuffle = (arr: typeof returnArray) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j]!, arr[i]!];
    }
    return arr;
  };
  if (from) {
    const fromIndex = arr.indexOf(from);
    const validIndex = fromIndex >= 0 ? fromIndex : 0;
    const nextItems = arr.slice(validIndex + 1);
    returnArray = [
      ...nextItems.slice(0, validIndex),
      from,
      ...shuffle(nextItems),
    ];
    return returnArray;
  }
  return shuffle(returnArray);
}
