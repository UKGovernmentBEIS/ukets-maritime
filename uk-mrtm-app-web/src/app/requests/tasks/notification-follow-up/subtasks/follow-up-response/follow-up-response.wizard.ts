import { FollowUpTaskPayload } from '@requests/tasks/notification-follow-up/follow-up.types';

export const isWizardCompleted = (payload: FollowUpTaskPayload) => !!payload.followUpResponse;
