import { AttachedFile } from '@shared/types/attached-file.interface';

export interface FollowUpResponse {
  request: string;
  response: string;
  attachments: AttachedFile[];
}
