export const getTopRepeatedNumbers = (nums: string[]) => {
  return [...new Set(nums)].map((num) => {
    return {
      id: num,
      times: nums.filter((id) => id === num).length,
    };
  });
};
