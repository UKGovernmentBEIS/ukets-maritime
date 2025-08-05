import { SubTaskListMap } from '@shared/types';

export const uncorrectedMisstatementsMap: SubTaskListMap<{
  exist: string;
  itemAdd: string;
  itemEdit: string;
  itemDelete: string;
  list: string;
}> = {
  title: 'Uncorrected misstatements',
  exist: {
    title: 'Are there any misstatements that were not corrected before issuing this report?',
  },
  itemAdd: { title: 'Add a misstatement' },
  itemEdit: { title: 'Add a misstatement' },
  itemDelete: { title: 'Are you sure you want to delete the selected issue?' },
  list: { title: 'Misstatements not corrected before issuing this report' },
};
