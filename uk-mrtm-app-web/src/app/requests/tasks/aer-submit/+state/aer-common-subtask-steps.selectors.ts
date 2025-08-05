import { Provider } from '@angular/core';

import { REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY } from '@requests/+state';
import { aerCommonSubtaskStepsQuery } from '@requests/common/aer/+state';

export const aerCommonSubtaskStepsProvider: Provider = {
  provide: REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY,
  useValue: aerCommonSubtaskStepsQuery,
};
