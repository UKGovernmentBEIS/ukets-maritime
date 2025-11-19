import { FormControl } from '@angular/forms';

import { AerPortVisit, AerVoyage, AerVoyageDetails } from '@mrtm/api';

export type AerVoyageDetailsFormModel = Pick<AerVoyageDetails, 'ccu' | 'ccs' | 'smallIslandFerryReduction'> &
  Pick<AerVoyage, 'uniqueIdentifier'> & {
    departureDate: Date;
    arrivalDate: Date;
    arrivalTime: Date;
    departureTime: Date;
    departureCountry: AerPortVisit['country'];
    departurePort: AerPortVisit['port'];
    arrivalPort: AerPortVisit['port'];
    arrivalCountry: AerPortVisit['country'];
  };

export type AerVoyageDetailsFormGroup = Record<keyof AerVoyageDetailsFormModel, FormControl>;
