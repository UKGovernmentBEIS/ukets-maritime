import { RequestTaskPageContentFactory } from '@netz/common/request-task';

import { NonComplianceClosedComponent } from '@requests/timeline/non-compliance-closed/non-compliance-closed.component';

export const nonComplianceClosedTaskContent: RequestTaskPageContentFactory = () => {
  return {
    header: 'Details of closed task',
    component: NonComplianceClosedComponent,
  };
};
