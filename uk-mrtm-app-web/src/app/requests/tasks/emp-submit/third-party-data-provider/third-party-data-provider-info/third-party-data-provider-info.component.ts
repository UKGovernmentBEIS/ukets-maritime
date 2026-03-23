import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { TasksService, ThirdPartyDataProviderDTO } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, DetailsComponent } from '@netz/govuk-components';

import { EMP_SUBMIT_ROUTE_PREFIX } from '@requests/tasks/emp-submit/emp-submit.const';
import { IMPORT_THIRD_PARTY_DATA_PROVIDER_ROUTE_PATH } from '@requests/tasks/emp-submit/third-party-data-provider/third-party-data-provider.const';

@Component({
  selector: 'mrtm-third-party-data-provider-info',
  standalone: true,
  imports: [ButtonDirective, DetailsComponent, GovukDatePipe, RouterLink],
  templateUrl: './third-party-data-provider-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThirdPartyDataProviderInfoComponent {
  private readonly store = inject(RequestTaskStore);
  private readonly tasksService = inject(TasksService);
  private readonly requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId);

  readonly dataInfo = signal<ThirdPartyDataProviderDTO>(null);
  readonly importPagePath = './' + EMP_SUBMIT_ROUTE_PREFIX + '/' + IMPORT_THIRD_PARTY_DATA_PROVIDER_ROUTE_PATH;

  constructor() {
    effect(() => {
      if (this.requestTaskId()) {
        this.tasksService
          .getThirdPartyDataProviderInfoByRequestId(this.requestTaskId())
          .pipe(take(1))
          .subscribe((data) => this.dataInfo.set(data));
      }
    });
  }
}
