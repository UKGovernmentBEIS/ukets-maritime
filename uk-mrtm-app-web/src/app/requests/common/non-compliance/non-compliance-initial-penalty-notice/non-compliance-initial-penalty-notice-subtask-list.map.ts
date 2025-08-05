import { SubTaskListMap } from '@shared/types';

export const nonComplianceInitialPenaltyNoticeMap: SubTaskListMap<{
  upload: string;
}> = {
  title: 'Initial penalty notice details',
  caption: 'Upload initial penalty notice',
  upload: { title: 'Upload notice' },
};
