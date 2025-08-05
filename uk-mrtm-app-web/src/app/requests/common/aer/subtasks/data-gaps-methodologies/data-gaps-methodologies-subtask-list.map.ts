import { SubTaskListMap } from '@shared/types';

export const dataGapsMethodologiesMap: SubTaskListMap<{
  methodRequired: string;
  methodApproved: string;
  methodConservative: string;
  noConservativeMethodDetails: string;
  materialMisstatementExist: string;
  materialMisstatementDetails: string;
}> = {
  title: 'Methodologies to close data gaps',
  methodRequired: { title: 'Was a data gap method required during the reporting year?' },
  methodApproved: { title: 'Has the data gap method already been approved by the regulator?' },
  methodConservative: { title: 'Was the method used conservative?' },
  noConservativeMethodDetails: { title: 'Provide more detail' },
  materialMisstatementExist: { title: 'Did the method lead to a material misstatement?' },
  materialMisstatementDetails: { title: 'Provide more detail' },
};
