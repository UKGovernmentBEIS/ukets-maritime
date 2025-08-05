import { Provider } from '@angular/core';

import { RequestActionDTO } from '@mrtm/api';

import { RELATED_PRINTABLE_ITEMS_MAP } from '@netz/common/components';
import { TASK_STATUS_TAG_MAP } from '@netz/common/pipes';
import { ITEM_TYPE_TO_RETURN_TEXT_MAPPER, RequestActionStore, TYPE_AWARE_STORE } from '@netz/common/store';

import { relatedPrintableItemsMap } from '@requests/common/related-printable-items.map';
import { statusTagMap } from '@requests/common/status-tag.map';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

const actionTypeToReturnText = (type: RequestActionDTO['type'], year?: string | number): string => {
  return taskActionTypeToTitleTransformer(type, year) ?? 'Dashboard';
};

export const actionProviders: Provider[] = [
  { provide: TASK_STATUS_TAG_MAP, useValue: statusTagMap },
  { provide: TYPE_AWARE_STORE, useExisting: RequestActionStore },
  { provide: ITEM_TYPE_TO_RETURN_TEXT_MAPPER, useValue: actionTypeToReturnText },
  { provide: RELATED_PRINTABLE_ITEMS_MAP, useValue: relatedPrintableItemsMap },
];
