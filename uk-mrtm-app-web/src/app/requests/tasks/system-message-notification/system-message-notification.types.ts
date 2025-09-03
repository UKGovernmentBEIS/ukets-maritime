import { RequestTaskPayload } from '@mrtm/api';

export interface SystemMessageNotificationRequestTaskPayload extends RequestTaskPayload {
  subject: string;
  text: string;
}

export interface SystemMessageParsedPart {
  text: string;
  route?: string;
  fragment?: string;
}
