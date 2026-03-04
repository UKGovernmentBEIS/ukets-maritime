import { InjectionToken } from '@angular/core';

import { RequestTaskState, StateSelector } from '@netz/common/store';

import { EmpTaskPayload } from '@requests/common';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';

export const IMPORT_THIRD_PARTY_DATA_PROVIDER_ROUTE_PATH = 'import-third-party-data-provider';
export const IMPORT_THIRD_PARTY_DATA_PROVIDER_SUB_TASK = 'importThirdPartyDataProvider';

export const SUBTASKS_AFFECTED_BY_IMPORT = new InjectionToken<Array<string>>('SUBTASKS_AFFECTED_BY_IMPORT');
export const TASK_ROUTE_PREFIX_MAP: Record<string, string> = {
  AER_APPLICATION_SUBMIT: 'aer',
  AER_APPLICATION_AMENDS_SUBMIT: 'aer',
  EMP_ISSUANCE_APPLICATION_SUBMIT: 'emp',
};

export const SECTIONS_COMPLETED_SELECTOR = new InjectionToken<
  StateSelector<RequestTaskState, EmpTaskPayload['empSectionsCompleted'] | AerSubmitTaskPayload['aerSectionsCompleted']>
>('Sections completed selector');
