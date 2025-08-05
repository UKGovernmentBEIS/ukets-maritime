import { BusinessError } from '@netz/common/error';

import { nonComplianceDetailsMap } from '@requests/common/non-compliance';

export const nonComplianceSubmitValidationError = (taskId: number) =>
  new BusinessError('Non-compliance details cannot be completed due to validation errors.').withLink({
    link: ['/tasks', taskId],
    linkText: `Return to: ${nonComplianceDetailsMap.title}`,
  });
