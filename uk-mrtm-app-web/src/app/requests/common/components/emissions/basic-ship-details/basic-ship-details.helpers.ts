import { ShipDetails } from '@mrtm/api';

export const BASIC_SHIP_DETAILS_STEP = 'basic-details';

export const shouldShowHasIceClassDerogation = (iceClassValue: ShipDetails['iceClass']): boolean => {
  switch (iceClassValue) {
    case null:
    case undefined:
    case 'IB':
    case 'IC':
    case 'NA':
      return false;
    default:
      return true;
  }
};
