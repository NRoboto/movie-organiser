export const stringIsNumber = (str: string) =>
  !isNaN(((str as unknown) as number) * 1);
export const stringIsInt = (str: string) =>
  stringIsNumber(str) && !str.includes(".");
