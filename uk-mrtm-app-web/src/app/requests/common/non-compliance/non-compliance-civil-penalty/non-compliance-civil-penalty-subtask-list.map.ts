import { SubTaskListMap } from '@shared/types';

export const nonComplianceCivilPenaltyMap: SubTaskListMap<{
  upload: string;
  penaltyAmount: string;
}> = {
  title: 'Civil penalty notice details',
  caption: 'Upload civil penalty notice',
  upload: { title: 'Upload notice' },
  penaltyAmount: { title: 'Final penalty amount' },
};
