import { InjectionToken } from '@angular/core';

import {
  AerOperatorDetails,
  AerShipEmissions,
  EmissionsSources,
  EmpEmissionsSources,
  EmpOperatorDetails,
  EmpShipEmissions,
} from '@mrtm/api';

import { RequestTaskState, StateSelector } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { AttachedFile, FuelsAndEmissionsFactors, ShipEmissionTableListItem } from '@shared/types';

// Used to provide state selectors for common subtask steps in EMP and AER
export interface RequestTaskCommonSubtaskStepsQuery {
  selectIsSubtaskCompleted: (subtask: string) => StateSelector<RequestTaskState, boolean>;
  selectAttachments: StateSelector<RequestTaskState, { [key: string]: string }>;
  selectAttachedFiles: (files?: string[]) => StateSelector<RequestTaskState, AttachedFile[]>;

  selectOperatorDetails: StateSelector<RequestTaskState, EmpOperatorDetails | AerOperatorDetails>;

  selectShips: StateSelector<
    RequestTaskState,
    Array<EmpShipEmissions & { status: TaskItemStatus }> | Array<AerShipEmissions & { status: TaskItemStatus }>
  >;
  selectShip: (shipId: string) => StateSelector<RequestTaskState, EmpShipEmissions | AerShipEmissions>;
  selectShipName: (shipId: string) => StateSelector<RequestTaskState, string>;
  selectShipFuelsAndEmissionsFactors: (shipId: string) => StateSelector<RequestTaskState, FuelsAndEmissionsFactors[]>;
  selectShipFuelsAndEmissionsFactorsItem: (
    shipId: string,
    factoryId: string,
  ) => StateSelector<RequestTaskState, FuelsAndEmissionsFactors>;

  selectShipEmissionSources: (
    shipId: string,
  ) => StateSelector<RequestTaskState, (EmissionsSources | EmpEmissionsSources)[]>;

  selectShipMonitoringMethods: (shipId: string) => StateSelector<RequestTaskState, Array<any>>;
  selectListOfShips: StateSelector<RequestTaskState, Array<ShipEmissionTableListItem>>;
}

export const REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY: InjectionToken<RequestTaskCommonSubtaskStepsQuery> =
  new InjectionToken<RequestTaskCommonSubtaskStepsQuery>('Request task common subtask steps selectors');
