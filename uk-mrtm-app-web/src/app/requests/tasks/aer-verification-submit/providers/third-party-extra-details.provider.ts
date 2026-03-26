import { computed, Provider } from '@angular/core';

import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { EXTRA_DETAILS } from '@requests/common/third-party-data-provider';
import {
  thirdPartyDataProviderQuery,
  ThirdPartyDataProviderStore,
} from '@requests/common/third-party-data-provider/+state';
import { isNil } from '@shared/utils';

export const provideThirdPartyExtraDetails = (): Provider => ({
  provide: EXTRA_DETAILS,
  deps: [RequestTaskStore, ThirdPartyDataProviderStore],
  useFactory: (requestTaskStore: RequestTaskStore, thirdPartyDataProviderStore: ThirdPartyDataProviderStore) => {
    return computed(() => {
      const smfExist = requestTaskStore.select(aerCommonQuery.selectReductionClaim)()?.exist;
      const importPayload = thirdPartyDataProviderStore.select(
        thirdPartyDataProviderQuery.selectThirdPartyDataProviderInfo,
      )()?.payload;

      return smfExist && isNil(importPayload?.['emissionsReductionClaimVerification'])
        ? [
            'The data supplier has not provided any emissions reduction claim data for this report. Emissions reduction claim records will not be imported.',
          ]
        : undefined;
    });
  },
});
