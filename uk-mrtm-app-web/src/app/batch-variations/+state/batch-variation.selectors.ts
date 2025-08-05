import { EmpBatchReissueRequestCreateActionPayload } from '@mrtm/api';

import { createDescendingSelector, createSelector, StateSelector } from '@netz/common/store';

import { BatchVariationState, EmpBatchVariationTableItemDTO } from '@batch-variations/batch-variations.types';
import { TaskItemStatus } from '@requests/common';
import { BatchVariationSummaryModel } from '@shared/types';

const selectItems: StateSelector<BatchVariationState, BatchVariationState['requestDetails']> = createSelector<
  BatchVariationState,
  Array<EmpBatchVariationTableItemDTO>
>((state) =>
  (state?.requestDetails ?? []).map((item) => {
    const requestStatus = item?.requestStatus;
    return {
      id: item?.id,
      createdBy: item?.requestMetadata?.submitter,
      createdDate: requestStatus === TaskItemStatus.IN_PROGRESS ? undefined : item?.requestMetadata?.submissionDate,
      emitters:
        requestStatus === TaskItemStatus.IN_PROGRESS
          ? undefined
          : Object.keys(item?.requestMetadata?.accountsReports ?? {}).length,
    };
  }),
);

const selectCurrentPage: StateSelector<BatchVariationState, number> = createSelector((state) => state?.page ?? 0);
const selectTotalItems: StateSelector<BatchVariationState, number> = createSelector((state) => state?.total ?? 0);
const selectCanInitiateBatchReissue: StateSelector<BatchVariationState, boolean> = createSelector(
  (state) => state?.canInitiateBatchReissue ?? false,
);

const selectCurrentItem: StateSelector<BatchVariationState, EmpBatchReissueRequestCreateActionPayload> = createSelector(
  (state) => state?.currentItem,
);

const selectCurrentItemSummaryModel: StateSelector<BatchVariationState, BatchVariationSummaryModel> =
  createDescendingSelector(selectCurrentItem, (currentItem) => ({
    summary: currentItem?.summary,
    signatory: currentItem?.signatory,
  }));

export const batchVariationsQuery = {
  selectItems,
  selectCurrentPage,
  selectTotalItems,
  selectCanInitiateBatchReissue,
  selectCurrentItem,
  selectCurrentItemSummaryModel,
};
