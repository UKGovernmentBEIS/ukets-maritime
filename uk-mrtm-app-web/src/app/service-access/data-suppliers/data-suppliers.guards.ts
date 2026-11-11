import { inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { map } from 'rxjs';

import { VerificationBodyThirdPartyDataProvidersService } from '@mrtm/api';

import { FeedbackBannerStore } from '@netz/common/components';

import { dataSuppliersQuery, DataSuppliersStore } from '@service-access/data-suppliers/+state';
import { isDataSupplierValid } from '@service-access/data-suppliers/data-suppliers.helpers';
import { isNil } from '@shared/utils';

// Regulator flows: managing the data supplier profiles

export const canActivateDataSupplierForm: CanActivateFn = (activatedRoute: ActivatedRouteSnapshot) => {
  const store = inject(DataSuppliersStore);
  const isEditable = store.select(dataSuppliersQuery.selectIsEditable)();
  store.resetNewItem();

  return isEditable || createUrlTreeFromSnapshot(activatedRoute, ['../../'], undefined, 'data-suppliers');
};

export const canActivateDataSupplierSummary: CanActivateFn = (activatedRoute: ActivatedRouteSnapshot) => {
  const store = inject(DataSuppliersStore);
  const newItem = store.select(dataSuppliersQuery.selectNewItem)();

  return isDataSupplierValid(newItem) || createUrlTreeFromSnapshot(activatedRoute, ['../']);
};

// Verifier flows: appointing a data supplier to the verification body

export const canActivateAppointDataSupplier: CanActivateFn = (activatedRoute: ActivatedRouteSnapshot) => {
  const dataSupplierId = activatedRoute.queryParams?.dataSupplierId;
  const formGroup = new UntypedFormGroup({});
  const service = inject(VerificationBodyThirdPartyDataProvidersService);
  const feedbackBannerStore = inject(FeedbackBannerStore);

  feedbackBannerStore.reset();

  return service.getThirdPartyDataProviderOfVerificationBody().pipe(
    map((res) => {
      if ((isNil(res?.id) && isNil(dataSupplierId)) || res?.id === Number(dataSupplierId)) {
        return true;
      }

      formGroup.setErrors({
        invalid:
          'This role has already been updated by another user. You can refresh the page to view the current information.',
      });
      feedbackBannerStore.setInvalidForm(formGroup);
      return createUrlTreeFromSnapshot(activatedRoute, ['../../'], undefined, 'data-suppliers');
    }),
  );
};
