export const wait = async (timeout = 1000) => {
  return await new Promise((res) => setTimeout(() => res(timeout), timeout));
};
