import { ChangeDetectionStrategy, Component, computed, input, InputSignal, Signal } from '@angular/core';

import { UncorrectedItem, VerifierComment } from '@mrtm/api';

import { TaskItem } from '@netz/common/model';
import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

@Component({
  selector: 'mrtm-vir-submit-task-item-details',
  standalone: true,
  imports: [SummaryListComponent, SummaryListRowDirective, SummaryListRowKeyDirective, SummaryListRowValueDirective],
  templateUrl: './vir-submit-task-item-details.component.html',
  styleUrl: './vir-submit-task-item-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirSubmitTaskItemDetailsComponent {
  public readonly taskItem: InputSignal<TaskItem> = input<TaskItem>();

  public readonly explanation: Signal<string> = computed(() => {
    const { data } = this.taskItem();
    return (data?.verificationDataItem as UncorrectedItem | VerifierComment)?.explanation;
  });
}
