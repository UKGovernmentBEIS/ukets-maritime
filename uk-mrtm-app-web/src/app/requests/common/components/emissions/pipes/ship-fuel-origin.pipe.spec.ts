import { ShipFuelOriginPipe } from '@requests/common/components/emissions/pipes/ship-fuel-origin.pipe';

describe('ShipFuelOriginPipe', () => {
  it('create an instance', () => {
    const pipe = new ShipFuelOriginPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return correct value', () => {
    const pipe = new ShipFuelOriginPipe();

    expect(pipe.transform('BIOFUEL')).toEqual('Biofuels');
    expect(pipe.transform('RFNBO')).toEqual('RFNBO e-fuels');
    expect(pipe.transform('FOSSIL')).toEqual('Fossil fuel');
  });
});
