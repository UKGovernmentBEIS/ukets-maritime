import { inject } from '@angular/core';

import { AuthStore } from '@netz/common/auth';
import { RequestTaskIsEditableResolver } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { MrtmRequestActionType, MrtmRequestTaskActionType } from '@shared/types';

export const isEditableExtraTaskResolverMap: Record<
  MrtmRequestTaskActionType | MrtmRequestActionType,
  RequestTaskIsEditableResolver
> = {
  EMP_ISSUANCE_WAIT_FOR_AMENDS: () => false,
  EMP_ISSUANCE_APPLICATION_PEER_REVIEW: () => false,
  EMP_VARIATION_APPLICATION_PEER_REVIEW: () => false,
  EMP_VARIATION_REGULATOR_LED_APPLICATION_PEER_REVIEW: () => false,
  EMP_VARIATION_WAIT_FOR_AMENDS: () => false,
  EMP_ISSUANCE_WAIT_FOR_PEER_REVIEW: () => false,
  EMP_VARIATION_WAIT_FOR_PEER_REVIEW: () => false,
  DOE_APPLICATION_PEER_REVIEW: () => false,
  NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_APPLICATION_PEER_REVIEW: () => false,
  NON_COMPLIANCE_NOTICE_OF_INTENT_APPLICATION_PEER_REVIEW: () => false,
  NON_COMPLIANCE_CIVIL_PENALTY_APPLICATION_PEER_REVIEW: () => false,
};

export const isEditableTaskResolver: RequestTaskIsEditableResolver = () => {
  const store = inject(RequestTaskStore);
  const authStore = inject(AuthStore);

  const assigneeUserId = store.select(requestTaskQuery.selectAssigneeUserId)();
  const userId = authStore.state.userState?.userId;
  const allowedRequestTaskActions = store.select(requestTaskQuery.selectAllowedRequestTaskActions)();
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

  return (
    assigneeUserId === userId &&
    allowedRequestTaskActions?.length > 0 &&
    (isEditableExtraTaskResolverMap[requestTaskType]?.() ?? true)
  );
};
