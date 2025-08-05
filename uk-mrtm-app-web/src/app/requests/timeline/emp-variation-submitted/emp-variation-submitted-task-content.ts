import { RequestTaskPageContentFactory } from '@netz/common/request-task';

import { getEmpTaskSectionsContent } from '@requests/common';

export const empVariationSubmittedTaskContent: RequestTaskPageContentFactory = getEmpTaskSectionsContent(
  'emp-variation-submitted',
  true,
);
