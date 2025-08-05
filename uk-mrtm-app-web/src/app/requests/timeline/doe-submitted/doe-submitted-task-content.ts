import { RequestTaskPageContentFactory } from '@netz/common/request-task';

import { DoeSubmittedComponent } from '@requests/timeline/doe-submitted/doe-submitted.component';

export const doeSubmittedTaskContent: RequestTaskPageContentFactory = () => {
  return {
    header: 'Maritime emissions updated',
    component: DoeSubmittedComponent,
    sections: [],
  };
};
