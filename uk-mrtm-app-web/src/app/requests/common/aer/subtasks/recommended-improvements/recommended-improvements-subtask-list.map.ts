import { SubTaskListMap } from '@shared/types';

export const recommendedImprovementsMap: SubTaskListMap<{
  exist: string;
  improvementAdd: string;
  improvementEdit: string;
  improvementDelete: string;
}> = {
  title: 'Recommended improvements',
  exist: { title: 'Are there any recommended improvements?' },
  improvementAdd: { title: 'Add a recommended improvement?' },
  improvementEdit: { title: 'Add a recommended improvement' },
  improvementDelete: { title: 'Are you sure you want to delete the selected item?' },
};
