import { ThirdPartyDataProviderStagingDetailsDTO } from '@mrtm/api';

import { createDescendingSelector, createSelector, StateSelector } from '@netz/common/store';

import { ThirdPartyDataProviderState } from '@requests/common/third-party-data-provider/third-party-data-provider.types';

const selectState = createSelector<ThirdPartyDataProviderState, ThirdPartyDataProviderState>((state) => state);

const selectThirdPartyDataProviderInfo: StateSelector<
  ThirdPartyDataProviderState,
  ThirdPartyDataProviderState['thirdPartyDataProviderInfo']
> = createDescendingSelector(selectState, (state) => state?.thirdPartyDataProviderInfo);

const selectProviderName: StateSelector<
  ThirdPartyDataProviderState,
  ThirdPartyDataProviderStagingDetailsDTO['providerName']
> = createDescendingSelector(selectThirdPartyDataProviderInfo, (state) => state?.providerName);

export const thirdPartyDataProviderQuery = {
  selectState,
  selectThirdPartyDataProviderInfo,
  selectProviderName,
};
