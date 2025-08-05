import { SubTaskListMap } from '@shared/types';

export const followUpAmendMap: SubTaskListMap<{
  amendsDetails: string;
  followUpResponse: string;
  submitToRegulator: string;
}> = {
  title: 'Amend your notification follow-up',
  amendsDetails: {
    title: 'Details of the amends needed',
  },
  followUpResponse: {
    title: 'Follow-up response',
  },
  submitToRegulator: {
    title: 'Submit to regulator',
  },
};
