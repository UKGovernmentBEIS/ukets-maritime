import { createUrlTreeFromSnapshot, ResolveFn } from '@angular/router';

import { FollowUpResponseWizardStep } from '@requests/tasks/notification-follow-up/subtasks/follow-up-response/follow-up-response.helper';

const stepBacklinkResolvers: Record<FollowUpResponseWizardStep, () => string> = {
  [FollowUpResponseWizardStep.FOLLOW_UP_RESPONSE]: () => '../../../',
  [FollowUpResponseWizardStep.SUMMARY]: () => '../../',
};

export const followUpResponseBacklinkResolver =
  (step: FollowUpResponseWizardStep): ResolveFn<any> =>
  (route) => {
    route.queryParams = null;
    return createUrlTreeFromSnapshot(route, [stepBacklinkResolvers[step]()]).toString();
  };
