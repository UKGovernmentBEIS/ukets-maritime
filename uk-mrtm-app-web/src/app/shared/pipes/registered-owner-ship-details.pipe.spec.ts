import { RegisteredOwnerShipDetails } from '@mrtm/api';

import { RegisteredOwnerShipDetailsPipe } from '@shared/pipes/registered-owner-ship-details.pipe';

describe('RegisteredOwnerShipDetailsPipe', () => {
  it('create an instance', () => {
    const pipe = new RegisteredOwnerShipDetailsPipe();

    expect(pipe).toBeTruthy();
  });

  it('should return correct string when RegisteredOwnerShipDetails has properties', () => {
    const pipe = new RegisteredOwnerShipDetailsPipe();
    const details: RegisteredOwnerShipDetails = {
      name: 'Ever Green',
      imoNumber: '1000000',
    };

    expect(pipe.transform(details)).toEqual('Ever Green (IMO: 1000000)');
  });

  it('should return null when RegisteredOwnerShipDetails is null', () => {
    const pipe = new RegisteredOwnerShipDetailsPipe();

    expect(pipe.transform(null)).toEqual(null);
  });
});
