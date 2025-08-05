import { SubTaskListMap } from '@shared/types';

export const waitForPeerReviewMap: SubTaskListMap<{
  detailsOfChange: string;
}> = {
  title: 'Notification sent to peer reviewer',
  detailsOfChange: {
    title: 'Details of the change',
  },
};
