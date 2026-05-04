import { ChangeDetectionStrategy, Component, computed, input, InputSignal, Signal } from '@angular/core';

import { RegulatorImprovementResponse } from '@mrtm/api';

import { TaskItem } from '@netz/common/model';
import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

@Component({
  selector: 'mrtm-vir-respond-to-regulator-comments-task-item-details',
  imports: [SummaryListComponent, SummaryListRowDirective, SummaryListRowKeyDirective, SummaryListRowValueDirective],
  standalone: true,
  templateUrl: './vir-respond-to-regulator-comments-task-item-details.component.html',
  styleUrl: './vir-respond-to-regulator-comments-task-item-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirRespondToRegulatorCommentsTaskItemDetailsComponent {
  public readonly taskItem: InputSignal<TaskItem> = input<TaskItem>();

  public readonly improvementComments: Signal<string> = computed(() => {
    const { data } = this.taskItem();

    return (data?.regulatorImprovements as RegulatorImprovementResponse)?.operatorActions;
  });
}
