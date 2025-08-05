import { createDescendingSelector, RequestTaskState, StateSelector } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpRfiRespondTaskPayload } from '@requests/common/emp/request-for-information/request-for-information.types';

export const selectRespond: StateSelector<RequestTaskState, EmpRfiRespondTaskPayload['rfiResponsePayload']> =
  createDescendingSelector(
    empCommonQuery.selectPayload<EmpRfiRespondTaskPayload>(),
    (payload) => payload?.rfiResponsePayload,
  );

export const selectQuestion: StateSelector<RequestTaskState, EmpRfiRespondTaskPayload['rfiQuestionPayload']> =
  createDescendingSelector(
    empCommonQuery.selectPayload<EmpRfiRespondTaskPayload>(),
    (payload) => payload?.rfiQuestionPayload,
  );

export const selectAttachments: StateSelector<RequestTaskState, EmpRfiRespondTaskPayload['rfiAttachments']> =
  createDescendingSelector(
    empCommonQuery.selectPayload<EmpRfiRespondTaskPayload>(),
    (payload) => payload?.rfiAttachments,
  );

export const rfiRespondQuery = {
  selectRespond,
  selectQuestion,
  selectAttachments,
};
