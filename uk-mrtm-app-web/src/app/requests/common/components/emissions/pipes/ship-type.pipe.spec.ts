import { ShipTypePipe } from '@requests/common/components/emissions/pipes/ship-type.pipe';
import { SHIP_TYPE_SELECT_ITEMS } from '@shared/constants';

describe('ShipTypePipe', () => {
  it('create an instance', () => {
    const pipe = new ShipTypePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return correct value', () => {
    const pipe = new ShipTypePipe();

    expect(pipe.transform('GAS')).toEqual(SHIP_TYPE_SELECT_ITEMS.find((x) => x.value === 'GAS').text);
    expect(pipe.transform('CHEM')).toEqual(SHIP_TYPE_SELECT_ITEMS.find((x) => x.value === 'CHEM').text);
  });
});
