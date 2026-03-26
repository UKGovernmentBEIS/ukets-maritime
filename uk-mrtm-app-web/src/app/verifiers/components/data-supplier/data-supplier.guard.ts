import { inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRouteSnapshot, createUrlTreeFromSnapshot } from '@angular/router';

import { map } from 'rxjs';

import { VerificationBodyThirdPartyDataProvidersService } from '@mrtm/api';

import { NotificationBannerStore } from '@shared/components/notification-banner';
import { isNil } from '@shared/utils';

export const canActivateAppointDataSupplier = (activatedRoute: ActivatedRouteSnapshot) => {
  const dataSupplierId = activatedRoute.queryParams?.dataSupplierId;
  const formGroup = new UntypedFormGroup({});
  const service = inject(VerificationBodyThirdPartyDataProvidersService);
  const notificationBannerStore = inject(NotificationBannerStore);

  notificationBannerStore.reset();

  return service.getThirdPartyDataProviderOfVerificationBody().pipe(
    map((res) => {
      if ((isNil(res?.id) && isNil(dataSupplierId)) || res?.id === Number(dataSupplierId)) {
        return true;
      }

      formGroup.setErrors({
        invalid:
          'This role has already been updated by another user. You can refresh the page to view the current information.',
      });
      notificationBannerStore.setInvalidForm(formGroup);
      return createUrlTreeFromSnapshot(activatedRoute, ['../../'], undefined, 'data-supplier');
    }),
  );
};
