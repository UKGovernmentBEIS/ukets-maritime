import { inject, Service } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { CaExternalContactDTO } from '@mrtm/api';

import { BusinessErrorService, catchBadRequest, ErrorCodes } from '@netz/common/error';

import { DetailsGuard } from '@service-access/external-contacts/details/details.guard';
import { saveNotFoundExternalContactError } from '@service-access/external-contacts/errors/business-error';

@Service()
export class DeleteGuard {
  private readonly externalContactDetailsGuard = inject(DetailsGuard);
  private readonly businessErrorService = inject(BusinessErrorService);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.externalContactDetailsGuard
      .isExternalContactActive(route)
      .pipe(
        catchBadRequest(ErrorCodes.EXTCONTACT1000, () =>
          this.businessErrorService.showError(saveNotFoundExternalContactError),
        ),
      );
  }

  resolve(): CaExternalContactDTO {
    return this.externalContactDetailsGuard.resolve();
  }
}
