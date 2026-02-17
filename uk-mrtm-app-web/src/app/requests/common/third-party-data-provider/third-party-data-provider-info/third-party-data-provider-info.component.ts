import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { GovukDatePipe } from '@netz/common/pipes';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, DetailsComponent } from '@netz/govuk-components';

import {
  thirdPartyDataProviderQuery,
  ThirdPartyDataProviderStore,
} from '@requests/common/third-party-data-provider/+state';
import {
  IMPORT_THIRD_PARTY_DATA_PROVIDER_ROUTE_PATH,
  TASK_ROUTE_PREFIX_MAP,
} from '@requests/common/third-party-data-provider/third-party-data-provider.const';

@Component({
  selector: 'mrtm-third-party-data-provider-info',
  imports: [ButtonDirective, DetailsComponent, GovukDatePipe, RouterLink],
  standalone: true,
  templateUrl: './third-party-data-provider-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThirdPartyDataProviderInfoComponent {
  private readonly thirdPartyDataProviderStore = inject(ThirdPartyDataProviderStore);
  private readonly store = inject(RequestTaskStore);
  private readonly requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId);
  private readonly requestTaskType = this.store.select(requestTaskQuery.selectRequestTaskType);
  readonly dataInfo = this.thirdPartyDataProviderStore.select(
    thirdPartyDataProviderQuery.selectThirdPartyDataProviderInfo,
  );
  readonly importPagePath = `./${TASK_ROUTE_PREFIX_MAP[this.requestTaskType()]}/${IMPORT_THIRD_PARTY_DATA_PROVIDER_ROUTE_PATH}`;

  constructor() {
    effect(() => {
      if (this.requestTaskId()) {
        this.thirdPartyDataProviderStore.loadProviderInfo(this.requestTaskId()).pipe(take(1)).subscribe();
      }
    });
  }
}
