import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { take } from 'rxjs';

import { VerificationBodyThirdPartyDataProvidersService } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { ButtonDirective } from '@netz/govuk-components';

import { selectIsEditableVerifierUsersList } from '@service-access/verifiers/+state/verifier-user.selectors';
import { VerifierUserStore } from '@service-access/verifiers/+state/verifier-user.store';
import { VaDataSupplierDetailsTableComponent } from '@shared/components';

/** The verifier's "Data suppliers" tab: the data supplier appointed to the verification body */
@Component({
  selector: 'mrtm-verifier-data-suppliers-tab',
  imports: [ButtonDirective, VaDataSupplierDetailsTableComponent],
  templateUrl: './verifier-data-suppliers-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifierDataSuppliersTabComponent {
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);
  private readonly verifierUserStore = inject(VerifierUserStore);
  private readonly verificationBodyThirdPartyDataProvidersService = inject(
    VerificationBodyThirdPartyDataProvidersService,
  );

  readonly userRole = this.authStore.select(selectUserRoleType);
  readonly editable = toSignal(this.verifierUserStore.pipe(selectIsEditableVerifierUsersList));

  private readonly items = toSignal(
    this.verificationBodyThirdPartyDataProvidersService.getThirdPartyDataProviderOfVerificationBody().pipe(take(1)),
  );

  readonly data = computed(() => [this.items() ?? []].flat());

  // The data supplier flows live under the same path as the tab
  protected readonly routePrefix = '/service-access/data-suppliers';

  public appointDataSupplier(): void {
    this.router.navigate([this.routePrefix, 'appoint']);
  }
}
