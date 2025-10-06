import { EmissionsMonitoringPlan, EmpVariationDetails } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state/emp-common.selectors';
import { EmpVariationTaskPayload } from '@requests/common/emp/emp.types';
import { TaskItemStatus } from '@requests/common/task-item-status';

const selectPayload: StateSelector<RequestTaskState, EmpVariationTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload as EmpVariationTaskPayload,
);

export const selectEmpVariationDetailsCompleted: StateSelector<
  RequestTaskState,
  EmpVariationTaskPayload['empVariationDetailsCompleted']
> = createDescendingSelector(selectPayload, (payload) => payload?.empVariationDetailsCompleted);

const selectStatusForSubtask = (
  subtask: keyof EmissionsMonitoringPlan,
): StateSelector<RequestTaskState, TaskItemStatus> => {
  return createDescendingSelector(
    empCommonQuery.selectIsEmpSectionCompleted,
    (completed) => (completed?.[subtask] as TaskItemStatus) ?? TaskItemStatus.COMPLETED,
  );
};

const selectStatusForEmpVariationDetailsSubtask: StateSelector<RequestTaskState, TaskItemStatus> =
  createDescendingSelector(
    selectPayload,
    (payload) => (payload?.empVariationDetailsCompleted as TaskItemStatus) ?? TaskItemStatus.NOT_STARTED,
  );

const selectEmpVariationDetails: StateSelector<RequestTaskState, EmpVariationDetails> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.empVariationDetails,
);

const selectIsEmpSectionCompleted: StateSelector<RequestTaskState, boolean> = createAggregateSelector(
  empCommonQuery.selectEmpSectionsCompleted,
  selectEmpVariationDetailsCompleted,
  (empCompleted, detailsCompleted) => {
    if ((detailsCompleted ?? TaskItemStatus.NOT_STARTED) !== TaskItemStatus.COMPLETED) {
      return false;
    }

    for (const key of [
      'dataGaps',
      'emissions',
      'sources',
      'managementProcedures',
      'greenhouseGas',
      'controlActivities',
      'additionalDocuments',
      'abbreviations',
      'operatorDetails',
    ]) {
      if ((empCompleted?.[key] ?? TaskItemStatus.COMPLETED) !== TaskItemStatus.COMPLETED) {
        return false;
      }
    }

    return true;
  },
);

const selectIsChangesRequestedForSection = (
  empSection: keyof EmissionsMonitoringPlan,
): StateSelector<RequestTaskState, boolean> =>
  createDescendingSelector(selectEmpVariationDetails, (details) => {
    const empSectionChangesMap: Partial<Record<keyof EmissionsMonitoringPlan, Array<string>>> = {
      operatorDetails: ['CHANGE_EMP_HOLDER_NAME_OR_ADDRESS'],
      emissions: [
        'ADD_NEW_SHIP',
        'REMOVING_SHIP',
        'ADD_NEW_FUELS_OR_EMISSION_SOURCES',
        'CHANGE_MONITORING_METHOD',
        'USE_OF_CARBON',
        'CHANGE_MONITORING_METHOD',
      ],
      mandate: ['UPDATE_DELEGATED_RESPONSIBILITY'],
      sources: ['CHANGE_EMISSION_FACTOR_VALUES'],
    };

    if (!details?.changes?.length || !empSectionChangesMap?.[empSection]) {
      return false;
    }

    for (const change of empSectionChangesMap[empSection]) {
      if (details?.changes?.includes(change as any)) {
        return true;
      }
    }

    return false;
  });

export const empVariationQuery = {
  selectPayload,
  selectStatusForEmpVariationDetailsSubtask,
  selectEmpVariationDetails,
  selectIsEmpSectionCompleted,
  selectIsChangesRequestedForSection,
  selectStatusForSubtask,
};
