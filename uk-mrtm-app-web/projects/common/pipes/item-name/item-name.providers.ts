import { InjectionToken } from '@angular/core';

import { ItemNameTransformer } from './item-name.types';

export const ITEM_NAME_TRANSFORMER: InjectionToken<ItemNameTransformer> = new InjectionToken<ItemNameTransformer>(
  'Item name transformer',
);
