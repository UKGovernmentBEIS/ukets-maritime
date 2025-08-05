import { SubTaskListMap } from '@shared/types';

export const respondToFollowUpMap: SubTaskListMap<{
  followUpResponse: string;
  submitToRegulator: string;
}> = {
  title: 'Respond to notification follow-up',
  followUpResponse: {
    title: 'Follow-up response',
  },
  submitToRegulator: {
    title: 'Submit to regulator',
  },
};
