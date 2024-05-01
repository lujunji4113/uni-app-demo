export const toNumber = (val: string) => {
  try {
    return parseInt(val, 10);
  } catch {
    return 0;
  }
};
