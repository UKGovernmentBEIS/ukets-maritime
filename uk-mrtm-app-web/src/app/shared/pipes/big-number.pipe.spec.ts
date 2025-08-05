import { BigNumberPipe } from '@shared/pipes/big-number.pipe';

describe('BigNumberPipe', () => {
  const pipe = new BigNumberPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should default to 2 decimal value', () => {
    expect(pipe.transform(1.23456789)).toEqual('1.23');
  });

  it('should return NaN when input is invalid', () => {
    expect(pipe.transform('abc')).toEqual('NaN');
    expect(pipe.transform(null)).toEqual(null);
    expect(pipe.transform(undefined)).toEqual(undefined);
  });

  it('should correctly parse exponential notation', () => {
    expect(pipe.transform(1.23456789e5)).toEqual('123456.79');
  });

  it('should remove trailing zeros', () => {
    expect(pipe.transform(1.2345)).toEqual('1.23');
  });

  it('should return correct value without zeros at the end', () => {
    expect(pipe.transform('1.23450000000', 7)).toEqual('1.2345');
  });
});
