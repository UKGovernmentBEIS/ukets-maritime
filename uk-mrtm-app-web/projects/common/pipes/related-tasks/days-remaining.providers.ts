import { InjectionToken } from '@angular/core';

import { DaysRemainingInputTransformer } from './days-remaining.types';

export const DAYS_REMAINING_INPUT_TRANSFORMER: InjectionToken<DaysRemainingInputTransformer> =
  new InjectionToken<DaysRemainingInputTransformer>('Days remaining transformer');
