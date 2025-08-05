import { MrtmItemDTO } from '@mrtm/api';

export type DaysRemainingInputTransformer = (
  daysRemaining?: number,
  year?: string | number,
  taskType?: MrtmItemDTO['taskType'],
) => number | undefined;
