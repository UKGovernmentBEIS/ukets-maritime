import { UserStateDTO } from '@mrtm/api';

import { WorkflowMap } from '@accounts/containers/process-actions/process-actions.types';
import { MrtmRequestType } from '@shared/types';

export const processActionsDetailsTypesMap: Record<MrtmRequestType, string> = {
  ACCOUNT_CLOSURE: 'account closure',
  EMP_VARIATION: 'emission plan variation',
  EMP_NOTIFICATION: 'notification',
  NON_COMPLIANCE: 'non-compliance',
};

const operatorsWorkflowMessagesMap: WorkflowMap = {
  EMP_VARIATION: {
    title: 'Make a change to your emissions monitoring plan',
    button: 'Start an emission plan variation',
  },
  EMP_NOTIFICATION: {
    title: 'Notify the regulator of a non-significant change to your emissions monitoring plan',
    button: 'Start a notification',
  },
};

const regulatorsWorkflowMessagesMap: WorkflowMap = {
  ACCOUNT_CLOSURE: {
    title: 'Close this account',
    button: 'Start to close this account',
  },
  EMP_VARIATION: {
    title: 'Make a change to the emissions monitoring plan',
    button: 'Start an emission plan variation',
  },
  NON_COMPLIANCE: {
    title: 'Start a non-compliance task',
    button: 'Start a non-compliance task',
  },
};

export const userRoleWorkflowsMap: Record<UserStateDTO['roleType'], WorkflowMap> = {
  OPERATOR: operatorsWorkflowMessagesMap,
  REGULATOR: regulatorsWorkflowMessagesMap,
  VERIFIER: undefined,
  SECTOR_USER: undefined,
};
