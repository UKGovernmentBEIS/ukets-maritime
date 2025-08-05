import { InjectionToken } from '@angular/core';

import { RequestActionDTO } from '@mrtm/api';

export type RelatedPrintableItemsMap = Record<RequestActionDTO['type'], any>;

export const RELATED_PRINTABLE_ITEMS_MAP = new InjectionToken<RelatedPrintableItemsMap>('Related Printable Items Map');
