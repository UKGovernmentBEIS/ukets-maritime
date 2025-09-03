import { BusinessError } from '@netz/common/error';

import { nonComplianceFinalDeterminationDetailsMap } from '@requests/common/non-compliance';

export const nonComplianceFinalDeterminationValidationError = (taskId: number) =>
  new BusinessError('Non-compliance conclusion cannot be completed due to validation errors.').withLink({
    link: ['/tasks', taskId],
    linkText: `Return to: ${nonComplianceFinalDeterminationDetailsMap.title}`,
  });
