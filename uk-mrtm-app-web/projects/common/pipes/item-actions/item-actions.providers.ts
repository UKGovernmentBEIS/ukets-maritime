import { InjectionToken } from '@angular/core';

import { RequestActionDTO } from '@mrtm/api';

export type ItemActionsMap = Record<
  RequestActionDTO['type'],
  { text: string; transformed: boolean; linkable: boolean }
>;

export const ITEM_ACTIONS_MAP = new InjectionToken<ItemActionsMap>('Item actions map');

export type ItemActionTransformer = (
  actionType: RequestActionDTO['type'],
  year?: string | number,
  submitter?: string,
) => string;

export const ITEM_ACTION_TRANSFORMER: InjectionToken<ItemActionTransformer> = new InjectionToken<ItemActionTransformer>(
  'Item action transformer',
);
