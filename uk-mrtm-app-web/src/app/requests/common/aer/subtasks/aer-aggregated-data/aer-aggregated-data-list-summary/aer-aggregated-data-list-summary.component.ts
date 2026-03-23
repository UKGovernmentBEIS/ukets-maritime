import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  AER_AGGREGATED_DATA_SUB_TASK,
  AerAggregatedDataWizardStep,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { AggregatedDataListSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-aer-aggregated-data-list-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    RouterLink,
    LinkDirective,
    PendingButtonDirective,
    ReturnToTaskOrActionPageComponent,
    ButtonDirective,
    AggregatedDataListSummaryTemplateComponent,
  ],
  templateUrl: './aer-aggregated-data-list-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerAggregatedDataListSummaryComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly service = inject(TaskService<AerSubmitTaskPayload>);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public readonly wizardStep = AerAggregatedDataWizardStep;
  public readonly aggregatedData = this.store.select(aerCommonQuery.selectAggregatedDataList);
  public readonly editable: Signal<boolean> = this.store.select(requestTaskQuery.selectIsEditable);

  public readonly canSubmit: Signal<boolean> = computed(() => {
    const statuses = this.aggregatedData().map((port) => port.status);

    return (
      this.editable() &&
      statuses?.length &&
      statuses?.every((task) => task === TaskItemStatus.COMPLETED) &&
      this.store.select(aerCommonQuery.selectStatusForSubtask(AER_AGGREGATED_DATA_SUB_TASK))() !==
        TaskItemStatus.COMPLETED
    );
  });

  public onSubmit(): void {
    this.service
      .submitSubtask(AER_AGGREGATED_DATA_SUB_TASK, AerAggregatedDataWizardStep.SUMMARY, this.activatedRoute)
      .pipe(take(1))
      .subscribe();
  }
}
