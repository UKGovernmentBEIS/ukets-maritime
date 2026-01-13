import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { take } from 'rxjs';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { TaskService } from '@netz/common/forms';
import { GovukDatePipe } from '@netz/common/pipes';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import {
  ButtonDirective,
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
  WarningTextComponent,
} from '@netz/govuk-components';

import { TaskItemStatus } from '@requests/common';
import { IThirdPartyDataProviderService } from '@requests/common/services';
import {
  thirdPartyDataProviderQuery,
  ThirdPartyDataProviderStore,
} from '@requests/common/third-party-data-provider/+state';
import {
  IMPORT_THIRD_PARTY_DATA_PROVIDER_SUB_TASK,
  SECTIONS_COMPLETED_SELECTOR,
  SUBTASKS_AFFECTED_BY_IMPORT,
} from '@requests/common/third-party-data-provider/third-party-data-provider.const';
import { NotificationBannerStore } from '@shared/components/notification-banner';

@Component({
  selector: 'mrtm-third-party-data-provider-import',
  standalone: true,
  imports: [
    ButtonDirective,
    GovukDatePipe,
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    WarningTextComponent,
  ],
  templateUrl: './third-party-data-provider-import.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThirdPartyDataProviderImportComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly store = inject(RequestTaskStore);
  private readonly sectionsCompletedSelector = inject(SECTIONS_COMPLETED_SELECTOR);
  private readonly service = inject(TaskService) as IThirdPartyDataProviderService<unknown>;
  private readonly thirdPartyDataProviderStore = inject(ThirdPartyDataProviderStore);
  private readonly notificationBannerStore = inject(NotificationBannerStore);
  private readonly requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId);
  private readonly sectionsCompleted = this.store.select(this.sectionsCompletedSelector);
  private readonly affectedSubtasks = inject(SUBTASKS_AFFECTED_BY_IMPORT);

  readonly dataInfo = this.thirdPartyDataProviderStore.select(
    thirdPartyDataProviderQuery.selectThirdPartyDataProviderInfo,
  );
  readonly showWarning = computed<boolean>(() => {
    const sectionsCompleted = this.sectionsCompleted();

    return this.affectedSubtasks.some(
      (subtask) =>
        sectionsCompleted?.[subtask] != undefined &&
        sectionsCompleted?.[subtask] != null &&
        sectionsCompleted[subtask] !== TaskItemStatus.NOT_STARTED,
    );
  });

  constructor() {
    effect(() => {
      if (this.requestTaskId()) {
        this.thirdPartyDataProviderStore.loadProviderInfo(this.requestTaskId()).pipe(take(1)).subscribe();
      }
    });
  }

  onImportData() {
    this.service
      .importThirdPartyData(
        IMPORT_THIRD_PARTY_DATA_PROVIDER_SUB_TASK,
        null,
        this.activatedRoute,
        this.dataInfo().payload,
      )
      .pipe(take(1))
      .subscribe(() =>
        this.notificationBannerStore.setSuccessMessages([
          'The data has been successfully imported from the data supplier.',
        ]),
      );
  }
}
