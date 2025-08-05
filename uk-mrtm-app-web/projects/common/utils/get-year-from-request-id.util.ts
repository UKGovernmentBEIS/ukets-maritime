export const getYearFromRequestId = (requestId: string): string | undefined => {
  const year = requestId?.split('-')[1];
  const yearStringRegex = new RegExp(/^\d{4}$/);
  return yearStringRegex.test(year) ? year : undefined;
};
