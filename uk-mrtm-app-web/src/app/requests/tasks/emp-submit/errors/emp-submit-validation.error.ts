import { BusinessError } from '@netz/common/error';

//TODO: need to be specified by analytics team
export const empSubmitValidationError = (taskId: number) =>
  new BusinessError('Application cannot be sent to regulator due to validation errors.').withLink({
    link: ['/tasks', taskId],
    linkText: 'Return to: Apply for an emissions monitoring plan',
  });
