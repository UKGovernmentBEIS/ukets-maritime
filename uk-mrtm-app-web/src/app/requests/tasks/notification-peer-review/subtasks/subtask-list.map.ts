import { PeerReviewTaskPayload } from '@requests/tasks/notification-peer-review/peer-review.types';
import { SubTaskListMap } from '@shared/types';

export const detailsChangeMap: SubTaskListMap<PeerReviewTaskPayload> = {
  title: 'Details of the change',
};
