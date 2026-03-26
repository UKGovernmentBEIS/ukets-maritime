import { computed, Provider } from '@angular/core';

import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { SUCCESS_MESSAGES } from '@requests/common/third-party-data-provider';
import {
  thirdPartyDataProviderQuery,
  ThirdPartyDataProviderStore,
} from '@requests/common/third-party-data-provider/+state';

export const provideThirdPartySuccessMessage = (): Provider => ({
  provide: SUCCESS_MESSAGES,
  deps: [RequestTaskStore, ThirdPartyDataProviderStore],
  useFactory: (requestTaskStore: RequestTaskStore, thirdPartyDataProviderStore: ThirdPartyDataProviderStore) =>
    computed(() => {
      const smfExist = requestTaskStore.select(aerCommonQuery.selectReductionClaim)()?.exist;
      const importPayload = thirdPartyDataProviderStore.select(
        thirdPartyDataProviderQuery.selectThirdPartyDataProviderInfo,
      )()?.payload;

      if (smfExist && !importPayload?.['emissionsReductionClaimVerification']) {
        return [
          'The data has been added with the following exceptions:<br />The data supplier did not provide any emissions reduction claim data to import.',
        ];
      }

      if (!smfExist && importPayload?.['emissionsReductionClaimVerification'])
        return [
          'The data has been added with the following exceptions:<br />The operator did not add any emissions reduction claim data. Emissions reduction claim records were not imported',
        ];
      return undefined;
    }),
});
