import { taskActionTypeToTitleMap } from '@shared/constants';

export const getTitleByWorkflowTaskName = (value: string): string => {
  const taskName = taskActionTypeToTitleMap[value];

  switch (value) {
    case 'EMP_VARIATION_REGULATOR_LED_APPLICATION_PEER_REVIEW':
      return `${taskName} (Reg. led.)`;
    case 'EMP_VARIATION_APPLICATION_PEER_REVIEW':
      return `${taskName} (Op. led.)`;
    default:
      return taskName;
  }
};
