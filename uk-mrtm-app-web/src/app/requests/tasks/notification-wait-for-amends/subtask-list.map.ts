import { SubTaskListMap } from '@shared/types';

export const waitForAmendsMap: SubTaskListMap<{
  editDueDate: string;
}> = {
  title: 'Notification follow-up returned to operator',
  editDueDate: {
    title: 'Edit follow up response deadline',
  },
};
