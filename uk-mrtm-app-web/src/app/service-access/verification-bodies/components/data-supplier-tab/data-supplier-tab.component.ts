import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { filter, map, switchMap } from 'rxjs';

import { VerificationBodyThirdPartyDataProvidersService } from '@mrtm/api';

import { VaDataSupplierDetailsTableComponent } from '@shared/components';
import { isNil } from '@shared/utils';

@Component({
  selector: 'mrtm-data-supplier-tab',
  imports: [VaDataSupplierDetailsTableComponent],
  templateUrl: './data-supplier-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSupplierTabComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly service = inject(VerificationBodyThirdPartyDataProvidersService);

  readonly data = toSignal(
    this.activatedRoute.params.pipe(map((ro) => ro?.id)).pipe(
      filter((id) => !isNil(id)),
      switchMap((id: number) => this.service.getThirdPartyDataProviderOfVerificationBodyById(id)),
      map((data) =>
        [data ?? []]
          .flat()
          .filter(Boolean)
          .map((item) => ({ ...item, userType: 'Data supplier' })),
      ),
    ),
  );
}
