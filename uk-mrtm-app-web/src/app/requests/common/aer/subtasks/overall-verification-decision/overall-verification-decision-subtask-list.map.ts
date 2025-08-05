import { SubTaskListMap } from '@shared/types';

export const overallVerificationDecisionMap: SubTaskListMap<{
  type: string;
  commentsList: string;
  commentsFormAdd: string;
  commentsFormEdit: string;
  commentsDelete: string;
  notVerifiedReasons: string;
}> = {
  title: 'Overall decision',
  type: { title: 'What is your assessment of this report?' },
  commentsList: {
    title: 'List the reasons for your decision',
    description:
      'On the basis of your verification work these data are fairly stated, with the exception of the following reasons.',
  },
  commentsFormAdd: { title: 'Add a reason' },
  commentsFormEdit: { title: 'Add a reason' },
  commentsDelete: { title: 'Are you sure you want to remove the selected reason?' },
  notVerifiedReasons: { title: 'Select the reasons that this report cannot be verified' },
};
