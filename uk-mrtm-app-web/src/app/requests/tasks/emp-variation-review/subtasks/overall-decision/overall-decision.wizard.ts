import { EmpVariationDetermination } from '@mrtm/api';

import { TaskItemStatus } from '@requests/common';

export const isOverallDecisionCompleted = (determination: EmpVariationDetermination) => {
  return !!determination?.type;
};

export const isOverallDecisionAndReasonCompleted = (determination: EmpVariationDetermination) => {
  return (
    !!determination?.type &&
    ((determination.type == TaskItemStatus.APPROVED && !!determination?.summary) ||
      (determination.type == TaskItemStatus.REJECTED && !!determination?.summary && !!determination?.reason) ||
      (determination.type == TaskItemStatus.DEEMED_WITHDRAWN && !!determination?.reason))
  );
};
