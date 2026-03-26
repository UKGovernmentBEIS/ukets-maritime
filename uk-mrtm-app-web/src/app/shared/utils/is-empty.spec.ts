import { isEmpty } from '@shared/utils/is-empty';

describe('isEmpty', () => {
  it(`should return 'true' when ''`, () => {
    expect(isEmpty('')).toEqual(true);
  });

  it(`should return 'false' when 'test string'`, () => {
    expect(isEmpty('test string')).toEqual(false);
  });

  it(`should return 'true' when 'undefined'`, () => {
    expect(isEmpty(undefined)).toEqual(true);
  });

  it(`should return 'true' when 'null'`, () => {
    expect(isEmpty(null)).toEqual(true);
  });

  it(`should return 'true' when 'true'`, () => {
    expect(isEmpty(true)).toEqual(true);
  });

  it(`should return 'true' when '0'`, () => {
    expect(isEmpty(0)).toEqual(true);
  });

  it(`should return 'true' when '2'`, () => {
    expect(isEmpty(2)).toEqual(true);
  });

  it(`should return 'true' when '() => {}'`, () => {
    const testAdd = (a: number, b: number) => {
      return a + b;
    };

    expect(isEmpty(testAdd)).toEqual(true);
  });

  it(`should return '' when '[]'`, () => {
    expect(isEmpty([])).toEqual(true);
  });

  it(`should return 'false' when '[1, 2, 3]'`, () => {
    expect(isEmpty([1, 2, 3])).toEqual(false);
  });

  it(`should return 'false' when '{ a: 1 }'`, () => {
    expect(isEmpty({ a: 1 })).toEqual(false);
  });

  it(`should return 'false' when '{}'`, () => {
    expect(isEmpty({})).toEqual(true);
  });

  it(`should return 'false' when 'new Set()'`, () => {
    expect(isEmpty(new Set())).toEqual(true);
  });

  it(`should return 'false' when 'new Map()'`, () => {
    expect(isEmpty(new Map())).toEqual(true);
  });
});
