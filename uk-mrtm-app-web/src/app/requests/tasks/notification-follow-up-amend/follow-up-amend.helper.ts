import { RequestTaskDTO } from '@mrtm/api';

export const getFollowUpAmendHeader = (requestTaskType: RequestTaskDTO['type']): string => {
  switch (requestTaskType) {
    case 'EMP_NOTIFICATION_FOLLOW_UP_APPLICATION_AMENDS_SUBMIT':
      return 'Amend your notification follow-up';
  }
};
