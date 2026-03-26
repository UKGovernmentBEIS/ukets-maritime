import { createAggregateSelector, requestActionQuery, RequestActionState, StateSelector } from '@netz/common/store';

import { timelineCommonQuery } from '@requests/common';
import { RegistryAccountUpdateDto } from '@shared/types';

const selectRegistryAccountUpdated: StateSelector<RequestActionState, RegistryAccountUpdateDto> =
  createAggregateSelector(
    timelineCommonQuery.selectPayload<RegistryAccountUpdateDto>(),
    requestActionQuery.selectAction,
    (payload, action) => {
      return {
        accountDetails: {
          ...(payload?.accountDetails ?? {}),
          competentAuthority: action?.competentAuthority,
        },
        organisationStructure: payload?.organisationStructure,
      };
    },
  );

export const registryAccountUpdatedQuery = {
  selectRegistryAccountUpdated,
};
