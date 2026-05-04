import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { take } from 'rxjs';

import { VerificationBodyThirdPartyDataProvidersService } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { ButtonDirective } from '@netz/govuk-components';

import { VaDataSupplierDetailsTableComponent } from '@shared/components';
import { selectIsEditableVerifierUsersList } from '@verifiers/+state/verifier-user.selectors';
import { VerifierUserStore } from '@verifiers/+state/verifier-user.store';
import {
  DATA_SUPPLIER_ROUTE_PREFIX,
  getDataSupplierColumns,
} from '@verifiers/components/data-supplier/data-supplier.constants';

@Component({
  selector: 'mrtm-data-supplier',
  imports: [ButtonDirective, VaDataSupplierDetailsTableComponent],
  templateUrl: './data-supplier.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSupplierComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authStore = inject(AuthStore);
  private readonly verifierUserStore = inject(VerifierUserStore);
  private readonly verificationBodyThirdPartyDataProvidersService = inject(
    VerificationBodyThirdPartyDataProvidersService,
  );

  readonly userRole = this.authStore.select(selectUserRoleType);
  readonly editable = toSignal(this.verifierUserStore.pipe(selectIsEditableVerifierUsersList));
  readonly columns = computed(() => {
    const editable = this.editable();
    return getDataSupplierColumns(editable);
  });

  private readonly items = toSignal(
    this.verificationBodyThirdPartyDataProvidersService.getThirdPartyDataProviderOfVerificationBody().pipe(take(1)),
  );

  readonly data = computed(() => [this.items() ?? []].flat());

  public appointDataSupplier(): void {
    this.router.navigate([DATA_SUPPLIER_ROUTE_PREFIX, 'appoint'], { relativeTo: this.activatedRoute });
  }

  protected readonly DATA_SUPPLIER_ROUTE_PREFIX = DATA_SUPPLIER_ROUTE_PREFIX;
}
