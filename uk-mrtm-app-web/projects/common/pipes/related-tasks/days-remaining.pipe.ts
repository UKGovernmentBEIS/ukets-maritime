import { inject, Pipe, PipeTransform } from '@angular/core';

import { MrtmItemDTO } from '@mrtm/api';

import { DAYS_REMAINING_INPUT_TRANSFORMER } from './days-remaining.providers';
import { DaysRemainingInputTransformer } from './days-remaining.types';

@Pipe({
  name: 'daysRemaining',
  standalone: true,
})
export class DaysRemainingPipe implements PipeTransform {
  private readonly daysRemainingInputTransformer: DaysRemainingInputTransformer = inject(
    DAYS_REMAINING_INPUT_TRANSFORMER,
    { optional: true },
  );

  transform(days?: number, year?: string | number, taskType?: MrtmItemDTO['taskType']): string {
    days = this.daysRemainingInputTransformer ? this.daysRemainingInputTransformer(days, year, taskType) : days;
    return days != null ? (days >= 0 ? days.toString() : 'Overdue') : '';
  }
}
