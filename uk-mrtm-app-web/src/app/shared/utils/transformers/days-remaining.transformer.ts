import { MrtmItemDTO } from '@mrtm/api';

import { DaysRemainingInputTransformer } from '@netz/common/pipes';

import { isAer } from '@shared/utils/is-aer';

export const daysRemainingTransformer: DaysRemainingInputTransformer = (
  daysRemaining?: number,
  taskYear?: string | number,
  taskType?: MrtmItemDTO['taskType'],
): number | undefined => {
  if (isAer(taskType)) {
    const currentYear = new Date().getFullYear();

    if (+taskYear >= currentYear) {
      return undefined;
    }
  }
  return daysRemaining;
};
