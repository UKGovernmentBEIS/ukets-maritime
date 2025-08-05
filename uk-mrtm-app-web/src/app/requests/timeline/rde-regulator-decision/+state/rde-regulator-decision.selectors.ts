import { RdeDecisionForcedRequestActionPayload } from '@mrtm/api';

import { createAggregateSelector, RequestActionState, StateSelector } from '@netz/common/store';

import { timelineCommonQuery } from '@requests/common';
import { AttachedFile, RdeForceDecision } from '@shared/types';

const selectPayload: StateSelector<RequestActionState, RdeDecisionForcedRequestActionPayload> =
  timelineCommonQuery.selectPayload<RdeDecisionForcedRequestActionPayload>();

const selectFiles: StateSelector<RequestActionState, AttachedFile[]> = createAggregateSelector(
  selectPayload,
  timelineCommonQuery.selectDownloadUrl,
  (payload, downloadUrl) =>
    Object.entries(payload?.rdeAttachments ?? {}).map(([key, value]) => ({
      downloadUrl: `${downloadUrl}attachment/${key}`,
      fileName: value,
    })),
);

const selectRdeForceDecision: StateSelector<RequestActionState, RdeForceDecision> = createAggregateSelector(
  selectPayload,
  selectFiles,
  (payload, files) => ({
    decision: payload?.rdeForceDecisionPayload?.decision,
    evidence: payload?.rdeForceDecisionPayload?.evidence,
    files: files,
  }),
);

export const rdeRegulatorDecisionQuery = {
  selectPayload,
  selectRdeForceDecision,
};
