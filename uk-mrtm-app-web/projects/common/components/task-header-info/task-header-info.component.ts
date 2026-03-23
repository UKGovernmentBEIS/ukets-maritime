import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MrtmItemDTO } from '@mrtm/api';

import { DaysRemainingPipe } from '@netz/common/pipes';
import { getYearFromRequestId } from '@netz/common/utils';

@Component({
  selector: 'netz-task-header-info',
  standalone: true,
  template: `
    <div class="govuk-!-margin-top-2">
      <p class="govuk-body">
        <strong>Assigned to:</strong>
        {{ assignee }}
      </p>
    </div>
    @if (daysRemaining | daysRemaining: getYearFromRequestId(requestId) : taskType) {
      <div class="govuk-!-margin-top-2">
        <p class="govuk-body">
          <strong>Days Remaining:</strong>
          {{ daysRemaining | daysRemaining: getYearFromRequestId(requestId) : taskType }}
        </p>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DaysRemainingPipe],
})
export class TaskHeaderInfoComponent {
  @Input() assignee: string;
  @Input() daysRemaining: number;
  @Input() requestId: string;
  @Input() taskType: MrtmItemDTO['taskType'];

  readonly getYearFromRequestId = getYearFromRequestId;
}
