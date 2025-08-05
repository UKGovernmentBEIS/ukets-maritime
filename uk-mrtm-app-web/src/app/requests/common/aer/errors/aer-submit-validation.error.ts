import { BusinessError } from '@netz/common/error';

import { taskActionTypeToTitleTransformer } from '@shared/utils';

export const aerSubmitValidationError = (taskId: number, requestTaskType: string, year: string | number) =>
  new BusinessError('The report cannot be sent due to validation errors.').withLink({
    link: ['/tasks', taskId],
    linkText: `Return to: ${taskActionTypeToTitleTransformer(requestTaskType, year)}`,
  });

export const aerSubmitNoVerificationPerformedError = (taskId: number, requestTaskType: string, year: string | number) =>
  new BusinessError('The report cannot be sent to regulator because verification has not been performed.').withLink({
    link: ['/tasks', taskId],
    linkText: `Return to: ${taskActionTypeToTitleTransformer(requestTaskType, year)}`,
  });

export const aerSubmitGenericError = (taskId: number, requestTaskType: string, year: string | number) =>
  new BusinessError('There is a problem with the service. The report cannot be sent.').withLink({
    link: ['/tasks', taskId],
    linkText: `Return to: ${taskActionTypeToTitleTransformer(requestTaskType, year)}`,
  });
