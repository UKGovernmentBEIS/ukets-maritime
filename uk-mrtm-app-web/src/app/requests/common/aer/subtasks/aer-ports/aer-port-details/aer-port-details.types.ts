import { FormControl } from '@angular/forms';

import { AerPort, AerPortDetails, AerPortVisit } from '@mrtm/api';

export type AerPortDetailsModel = Omit<AerPortDetails, 'visit' | 'arrivalTime' | 'departureTime'> &
  AerPortVisit &
  Pick<AerPort, 'uniqueIdentifier'> & {
    arrivalDate: Date;
    arrivalTime: Date;
    departureTime: Date;
    departureDate: Date;
  };
export type AerPortDetailsFormGroupModel = Record<keyof AerPortDetailsModel, FormControl>;
