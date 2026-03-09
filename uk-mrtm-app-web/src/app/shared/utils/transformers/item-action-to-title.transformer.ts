import { RequestActionDTO } from '@mrtm/api';

import { ItemActionTransformer } from '@netz/common/pipes';

import { itemActionsMap } from '@requests/common/item-actions.map';
import { isVir } from '@shared/utils';
import { isAer } from '@shared/utils/is-aer';
import { isDoe } from '@shared/utils/is-doe';

export const itemActionToTitleTransformer: ItemActionTransformer = (
  actionType: RequestActionDTO['type'],
  year?: string | number,
  submitter?: string,
): string => {
  let text = itemActionsMap[actionType]?.text ?? null;
  const suffix = itemActionsMap[actionType]?.suffix ?? null;

  if ((isAer(actionType) || isDoe(actionType) || isVir(actionType)) && year) {
    text = text?.replace(/annual/i, `${year}`);
  }

  return !text
    ? null
    : `${itemActionsMap[actionType]?.transformed && submitter ? `${text} by ${submitter}` : text} ${!suffix ? '' : suffix}`.trim();
};
