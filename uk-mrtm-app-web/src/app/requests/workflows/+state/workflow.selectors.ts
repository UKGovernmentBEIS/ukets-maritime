import { isBefore } from 'date-fns';

import { RequestMetadata } from '@mrtm/api';

import { createDescendingSelector, createSelector, StateSelector } from '@netz/common/store';

import { WorkflowState } from '@requests/workflows/workflows.types';

const selectDetails: StateSelector<WorkflowState, WorkflowState['details']> = createSelector((state) => state?.details);
const selectActions: StateSelector<WorkflowState, WorkflowState['actions']> = createSelector((state) =>
  state?.actions?.sort((a, b) => (isBefore(new Date(a.creationDate), new Date(b.creationDate)) ? 1 : -1)),
);
const selectTasks: StateSelector<WorkflowState, WorkflowState['tasks']> = createSelector((state) => state?.tasks);
const selectWorkflowId: StateSelector<WorkflowState, string> = createSelector((state) => state?.details?.id);
const selectAerRelatedTasks: StateSelector<WorkflowState, WorkflowState['aerRelatedTasks']> = createSelector(
  (state) => state?.aerRelatedTasks,
);
const selectRequestMetaData: StateSelector<WorkflowState, RequestMetadata> = createDescendingSelector(
  selectDetails,
  (state) => state?.requestMetadata,
);

export const workflowsQuery = {
  selectActions,
  selectDetails,
  selectTasks,
  selectWorkflowId,
  selectAerRelatedTasks,
  selectRequestMetaData,
};
