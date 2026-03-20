import { computed, Provider } from '@angular/core';

import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { EXTRA_WARNING } from '@requests/common/third-party-data-provider';
import {
  thirdPartyDataProviderQuery,
  ThirdPartyDataProviderStore,
} from '@requests/common/third-party-data-provider/+state';
import { isNil } from '@shared/utils';

export const provideThirdPartyExtraWarnings = (): Provider => ({
  provide: EXTRA_WARNING,
  deps: [RequestTaskStore, ThirdPartyDataProviderStore],
  useFactory: (requestTaskStore: RequestTaskStore, thirdPartyDataProviderStore: ThirdPartyDataProviderStore) => {
    return computed(() => {
      const smfExist = requestTaskStore.select(aerCommonQuery.selectReductionClaim)()?.exist;
      const importPayload = thirdPartyDataProviderStore.select(
        thirdPartyDataProviderQuery.selectThirdPartyDataProviderInfo,
      )()?.payload;

      return !smfExist && !isNil(importPayload?.['emissionsReductionClaimVerification'])
        ? 'The operator did not add any emissions reduction claim data. Emissions reduction claim records will not be imported.'
        : undefined;
    });
  },
});
