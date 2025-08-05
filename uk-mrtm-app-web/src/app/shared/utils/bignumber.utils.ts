import BigNumber from 'bignumber.js';

const format = (value: BigNumber, maxDecimals: number = 5): string => {
  return value.decimalPlaces(maxDecimals, BigNumber.ROUND_HALF_UP).toFixed();
};

const getFixed = (value: string | number, digits: number = 2): string => {
  return new BigNumber(value).decimalPlaces(digits, BigNumber.ROUND_HALF_UP).toFixed();
};

const isInputBigNumberEmpty = (value: unknown): boolean => {
  return value === null || value === '' || !new BigNumber(String(value)).isFinite();
};

const getFixedOptional = (value: string | number, digits: number = 2): string | null => {
  return isInputBigNumberEmpty(value) ? null : getFixed(value, digits);
};

const getSum = (args: Array<number | string>, digits: number = 2, previousTotal?: string): string => {
  if (args.every(isInputBigNumberEmpty)) {
    return previousTotal ?? '0';
  }

  return getFixed(
    args.reduce((accumulator, current) => accumulator.plus(new BigNumber(+current)), new BigNumber(0)).toString(),
    digits,
  );
};

export const bigNumberUtils = {
  format,
  isInputBigNumberEmpty,
  getFixed,
  getFixedOptional,
  getSum,
};
