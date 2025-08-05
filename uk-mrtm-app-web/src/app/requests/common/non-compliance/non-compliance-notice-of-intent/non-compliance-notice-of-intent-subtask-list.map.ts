import { SubTaskListMap } from '@shared/types';

export const nonComplianceNoticeOfIntentMap: SubTaskListMap<{
  upload: string;
}> = {
  title: 'Notice of intent details',
  caption: 'Upload notice of intent',
  upload: { title: 'Upload notice' },
};
