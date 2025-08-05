import { BusinessError } from '@netz/common/error';

import { taskActionTypeToTitleTransformer } from '@shared/utils';

export const aerVerificationSubmitValidationError = (taskId: number, requestTaskType: string, year: string | number) =>
  new BusinessError('The report cannot be sent due to validation errors.').withLink({
    link: ['/tasks', taskId],
    linkText: `Return to: ${taskActionTypeToTitleTransformer(requestTaskType, year)}`,
  });
