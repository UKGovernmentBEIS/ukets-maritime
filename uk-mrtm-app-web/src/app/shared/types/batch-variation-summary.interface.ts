import { EmpBatchReissueRequestCreateActionPayload } from '@mrtm/api';

export type BatchVariationSummaryModel = Omit<EmpBatchReissueRequestCreateActionPayload, 'payloadType'>;
