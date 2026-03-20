import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MrtmItemDTO } from '@mrtm/api';

import { DaysRemainingPipe } from '@netz/common/pipes';
import { getYearFromRequestId } from '@netz/common/utils';

@Component({
  selector: 'netz-task-header-info',
  imports: [DaysRemainingPipe],
  standalone: true,
  template: `
    <div class="govuk-!-margin-top-2">
      <p class="govuk-body">
        <strong>Assigned to:</strong>
        {{ assignee() }}
      </p>
    </div>
    @if (daysRemaining() | daysRemaining: getYearFromRequestId(requestId()) : taskType()) {
      <div class="govuk-!-margin-top-2">
        <p class="govuk-body">
          <strong>Days Remaining:</strong>
          {{ daysRemaining() | daysRemaining: getYearFromRequestId(requestId()) : taskType() }}
        </p>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskHeaderInfoComponent {
  readonly assignee = input<string>();
  readonly daysRemaining = input<number>();
  readonly requestId = input<string>();
  readonly taskType = input<MrtmItemDTO['taskType']>();

  readonly getYearFromRequestId = getYearFromRequestId;
}
