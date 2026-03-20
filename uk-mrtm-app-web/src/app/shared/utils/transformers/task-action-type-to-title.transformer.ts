import { MrtmItemDTO } from '@mrtm/api';

import { ItemNameTransformer } from '@netz/common/pipes';

import { taskActionTypeToTitleMap } from '@shared/constants';
import { isAer, isDoe, isVir } from '@shared/utils';

export const taskActionTypeToTitleTransformer: ItemNameTransformer = (
  taskType: MrtmItemDTO['taskType'],
  year?: string | number,
): string => {
  if ((isAer(taskType) || isDoe(taskType) || isVir(taskType)) && year) {
    return taskActionTypeToTitleMap[taskType].replace(/annual/i, `${year}`);
  }

  return taskActionTypeToTitleMap[taskType] ?? null;
};
