import { cleanDeep } from '@shared/utils/clean-deep';

describe('cleanDeep', () => {
  it('should return expected cleanDeep results', () => {
    const object = {
      a: {},
      b: null,
      c: 'baz',
      d: '',
      e: [],
      f: undefined,
      g: {
        h: 'boz',
        i: '',
      },
      k: {
        l: {
          m: {},
        },
      },
    };

    expect(cleanDeep(object)).toEqual({
      c: 'baz',
      g: {
        h: 'boz',
      },
    });
  });
});
