import { SubTaskListMap } from '@shared/types';

export const uncorrectedNonConformitiesMap: SubTaskListMap<{
  exist: string;
  itemAdd: string;
  itemEdit: string;
  itemDelete: string;
  list: string;
  priorYearIssuesExist: string;
  priorYearIssueAdd: string;
  priorYearIssueEdit: string;
  priorYearIssueDelete: string;
  priorYearList: string;
}> = {
  title: 'Uncorrected non-conformities',
  exist: { title: 'Have there been any uncorrected non-conformities with the approved emissions monitoring plan?' },
  itemAdd: { title: 'Add a non-conformity with the approved emissions monitoring plan' },
  itemEdit: { title: 'Add a non-conformity with the approved emissions monitoring plan' },
  itemDelete: { title: 'Are you sure you want to delete the selected issue?' },
  list: { title: 'Non-conformities with the approved emissions monitoring plan' },
  priorYearIssuesExist: { title: 'Are there any non-conformities from the previous year that have not been resolved?' },
  priorYearIssueAdd: { title: 'Add a non-conformity from the previous year that has not been resolved' },
  priorYearIssueEdit: { title: 'Add a non-conformity from the previous year that has not been resolved' },
  priorYearIssueDelete: { title: 'Are you sure you want to delete the selected issue?' },
  priorYearList: { title: 'Non-conformities from the previous year that have not been resolved' },
};
