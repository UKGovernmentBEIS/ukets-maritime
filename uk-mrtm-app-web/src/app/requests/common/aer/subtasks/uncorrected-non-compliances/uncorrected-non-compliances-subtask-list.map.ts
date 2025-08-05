import { SubTaskListMap } from '@shared/types';

export const uncorrectedNonCompliancesMap: SubTaskListMap<{
  exist: string;
  itemAdd: string;
  itemEdit: string;
  itemDelete: string;
  list: string;
}> = {
  title: 'Uncorrected non-compliances',
  exist: {
    title:
      'Have there been any non-compliances with the maritime monitoring and reporting requirements in the UK ETS Order?',
  },
  itemAdd: { title: 'Add a non-compliance' },
  itemEdit: { title: 'Add a non-compliance' },
  itemDelete: { title: 'Are you sure you want to delete the selected issue?' },
  list: { title: 'Non-compliances with the maritime monitoring and reporting requirements' },
};
