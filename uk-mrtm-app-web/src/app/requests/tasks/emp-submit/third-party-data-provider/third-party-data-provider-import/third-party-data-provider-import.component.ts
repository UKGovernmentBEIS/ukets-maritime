import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { take } from 'rxjs';

import { TasksService } from '@mrtm/api';

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

import { empCommonQuery, EmpTaskPayload, TaskItemStatus } from '@requests/common';
import { EmpService } from '@requests/tasks/emp-submit/services';
import {
  IMPORT_THIRD_PARTY_DATA_PROVIDER_SUB_TASK,
  SUBTASKS_AFFECTED_BY_IMPORT,
} from '@requests/tasks/emp-submit/third-party-data-provider/third-party-data-provider.const';
import { ThirdPartyDataProviderDTOExtended } from '@requests/tasks/emp-submit/third-party-data-provider/third-party-data-provider.interface';
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
  private readonly empService = inject(TaskService<EmpTaskPayload>) as EmpService;
  private readonly tasksService = inject(TasksService);
  private readonly notificationBannerStore = inject(NotificationBannerStore);
  private readonly requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId);
  private readonly sectionsCompleted = this.store.select(empCommonQuery.selectEmpSectionsCompleted);

  readonly dataInfo = signal<ThirdPartyDataProviderDTOExtended>(null);
  readonly showWarning = computed<boolean>(() => {
    const sectionsCompleted = this.sectionsCompleted();
    return SUBTASKS_AFFECTED_BY_IMPORT.some(
      (subtask) =>
        sectionsCompleted?.[subtask] != undefined &&
        sectionsCompleted?.[subtask] != null &&
        sectionsCompleted[subtask] !== TaskItemStatus.NOT_STARTED,
    );
  });

  constructor() {
    effect(() => {
      if (this.requestTaskId()) {
        this.tasksService
          .getThirdPartyDataProviderInfoByRequestId(this.requestTaskId())
          .pipe(take(1))
          .subscribe((data) => this.dataInfo.set(data as ThirdPartyDataProviderDTOExtended));
      }
    });
  }

  onImportData() {
    this.empService
      .importThirdPartyData(
        IMPORT_THIRD_PARTY_DATA_PROVIDER_SUB_TASK,
        null,
        this.activatedRoute,
        this.dataInfo().payload,
      )
      .pipe(take(1))
      .subscribe(() =>
        this.notificationBannerStore.setSuccessMessages([
          'The data has been imported from the external source/system successfully.',
        ]),
      );
  }
}
