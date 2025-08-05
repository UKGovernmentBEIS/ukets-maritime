import { InjectionToken } from '@angular/core';

export const ITEM_LINK_REQUEST_TYPES_WHITELIST: InjectionToken<string[]> = new InjectionToken<string[]>(
  'Request types whitelist for Item Link pipe',
);
