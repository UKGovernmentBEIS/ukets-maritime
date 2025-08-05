import { MrtmItemDTO } from '@mrtm/api';

import { ItemNameTransformer } from '@netz/common/pipes';

import { taskActionTypeToTitleMap } from '@shared/constants';
import { isVir } from '@shared/utils';
import { isAer } from '@shared/utils/is-aer';
import { isDoe } from '@shared/utils/is-doe';

export const taskActionTypeToTitleTransformer: ItemNameTransformer = (
  taskType: MrtmItemDTO['taskType'],
  year?: string | number,
): string => {
  if ((isAer(taskType) || isDoe(taskType) || isVir(taskType)) && year) {
    return taskActionTypeToTitleMap[taskType].replace(/annual/i, `${year}`);
  }

  return taskActionTypeToTitleMap[taskType] ?? null;
};
