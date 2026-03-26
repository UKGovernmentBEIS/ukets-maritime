import { ChangeDetectionStrategy, Component, computed, input, InputSignal, Signal } from '@angular/core';

import { OperatorImprovementResponse } from '@mrtm/api';

import { TaskItem } from '@netz/common/model';
import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

@Component({
  selector: 'mrtm-vir-review-task-item-details',
  imports: [SummaryListComponent, SummaryListRowDirective, SummaryListRowKeyDirective, SummaryListRowValueDirective],
  standalone: true,
  templateUrl: './vir-review-task-item-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirReviewTaskItemDetailsComponent {
  public readonly taskItem: InputSignal<TaskItem> = input<TaskItem>();

  public readonly explanation: Signal<string> = computed(() => {
    const { data } = this.taskItem();
    return (data?.operatorResponse as OperatorImprovementResponse)?.addressedDescription;
  });
}
