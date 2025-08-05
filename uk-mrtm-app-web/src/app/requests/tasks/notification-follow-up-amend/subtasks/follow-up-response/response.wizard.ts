import { FollowUpAmendTaskPayload } from '@requests/tasks/notification-follow-up-amend/follow-up-amend.types';

export const isWizardCompleted = (payload: FollowUpAmendTaskPayload) => !!payload.followUpResponse;
