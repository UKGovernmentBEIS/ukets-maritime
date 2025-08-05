import { SubTaskListMap } from '@shared/types';

export const waitForFollowUpMap: SubTaskListMap<{
  editDueDate: string;
}> = {
  title: 'Notification follow-up request sent to operator',
  editDueDate: {
    title: 'Edit follow up response deadline',
  },
};
