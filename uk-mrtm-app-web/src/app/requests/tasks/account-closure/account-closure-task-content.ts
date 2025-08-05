import { RequestTaskPageContentFactory } from '@netz/common/request-task';

import { AccountClosureSubmitComponent } from '@requests/tasks/account-closure/components/account-closure-submit';

export const accountClosureTaskContent: RequestTaskPageContentFactory = () => {
  return {
    header: 'Close account',
    contentComponent: AccountClosureSubmitComponent,
  };
};
