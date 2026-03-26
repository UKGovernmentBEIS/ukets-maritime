import { RegistryRegulatorNoticeEventSubmittedRequestActionPayload } from '@mrtm/api';

import { createAggregateSelector, RequestActionState, StateSelector } from '@netz/common/store';

import { timelineCommonQuery } from '@requests/common';
import { RegistryNoticeEventSubmittedDto } from '@shared/types';
import { isNil } from '@shared/utils';

const selectRegistryNoticeEventPayload: StateSelector<RequestActionState, RegistryNoticeEventSubmittedDto> =
  createAggregateSelector(
    timelineCommonQuery.selectPayload<RegistryRegulatorNoticeEventSubmittedRequestActionPayload>(),
    timelineCommonQuery.selectDownloadUrl,
    (payload, downloadUrl) => {
      return {
        registryId: payload?.registryId,
        payloadType: payload?.payloadType,
        type: payload?.type,
        officialNotice: isNil(payload?.officialNotice)
          ? undefined
          : {
              fileName: payload?.officialNotice?.name,
              downloadUrl: `${downloadUrl}document/${payload?.officialNotice?.uuid}`,
            },
      };
    },
  );

export const registryNoticeEventSubmittedQuery = {
  selectRegistryNoticeEventPayload,
};
