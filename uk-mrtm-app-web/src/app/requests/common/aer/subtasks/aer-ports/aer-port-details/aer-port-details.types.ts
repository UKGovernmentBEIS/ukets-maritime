import { FormControl } from '@angular/forms';

import { AerPort, AerPortVisit } from '@mrtm/api';

export type AerPortDetailsModel = AerPortVisit &
  Pick<AerPort, 'uniqueIdentifier'> & {
    arrivalDate: Date;
    arrivalTime: Date;
    departureTime: Date;
    departureDate: Date;
  };
export type AerPortDetailsFormGroupModel = Record<keyof AerPortDetailsModel, FormControl>;
