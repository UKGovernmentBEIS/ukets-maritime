import { InjectionToken, Signal } from '@angular/core';

import {
  IReturnForAmendsService,
  ReviewAmendDecisionDTO,
} from '@requests/common/emp/return-for-amends/return-for-amends.types';

export const RETURN_FOR_AMENDS_SERVICE: InjectionToken<IReturnForAmendsService<unknown>> = new InjectionToken<
  IReturnForAmendsService<unknown>
>('Return for amends service');

export const AMENDS_NEEDED_GROUPS: InjectionToken<Signal<Array<ReviewAmendDecisionDTO>>> = new InjectionToken<
  Signal<Array<ReviewAmendDecisionDTO>>
>('Return for amends groups');

export const AMENDS_GROUP_SUBTASK_TITLES: InjectionToken<Record<string, string>> = new InjectionToken<
  Record<string, string>
>('Return for amends group subtask titles');
