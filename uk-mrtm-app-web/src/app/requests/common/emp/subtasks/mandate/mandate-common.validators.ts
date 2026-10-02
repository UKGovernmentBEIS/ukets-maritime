import { inject } from '@angular/core';
import { ValidationErrors, ValidatorFn } from '@angular/forms';

import { RegisteredOwnerShipDetails } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common';

export const validateAllIsmShipsHaveRegisteredOwner = (): ValidatorFn => {
  const store = inject(RequestTaskStore);
  const ismShips = store.select(empCommonQuery.selectIsmShipImoNumbers)();
  const mandate = store.select(empCommonQuery.selectMandate)();
  const registeredOwnersShips = new Set<RegisteredOwnerShipDetails['imoNumber']>(
    (mandate?.registeredOwners ?? [])
      .map((registeredOwner) => registeredOwner.ships.map((ship) => ship.imoNumber))
      .flat(),
  );
  return (): ValidationErrors | null =>
    registeredOwnersShips.size < ismShips.size
      ? {
          ismShipMissingRegisteredOwner:
            'You must associate all ships with delegated responsibility with a registered owner.',
        }
      : null;
};

export const hasNeedsReviewRegisteredOwners = (): ValidatorFn => {
  const store = inject(RequestTaskStore);
  const mandate = store.select(empCommonQuery.selectExtendedMandate)();

  return (): ValidationErrors | null =>
    (mandate?.registeredOwners ?? []).find((registeredOwner) => registeredOwner?.needsReview)
      ? {
          hasNeedsReviewRegisteredOwners:
            'The highlighted registered owners have been updated due to changes to the list of ships. Review the information for each highlighted registered owner, then select Continue.',
        }
      : null;
};
