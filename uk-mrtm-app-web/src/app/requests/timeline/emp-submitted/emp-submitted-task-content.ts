import { RequestTaskPageContentFactory } from '@netz/common/request-task';

import { getEmpTaskSectionsContent } from '@requests/common';

export const empSubmittedTaskContent: RequestTaskPageContentFactory = getEmpTaskSectionsContent('emp-submitted');
