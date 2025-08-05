import { EmpIssuanceDetermination } from '@mrtm/api';

import { TaskItemStatus } from '@requests/common';

export const isOverallDecisionCompleted = (determination: EmpIssuanceDetermination) => {
  return !!determination?.type;
};

export const isOverallDecisionAndReasonCompleted = (determination: EmpIssuanceDetermination) => {
  return (
    !!determination?.type &&
    (determination.type == TaskItemStatus.APPROVED ||
      (determination.type == TaskItemStatus.DEEMED_WITHDRAWN && !!determination?.reason))
  );
};
