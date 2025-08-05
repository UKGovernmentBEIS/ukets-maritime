import { AttachedFile } from '@shared/types/attached-file.interface';

export interface FollowUpResponseDTO {
  followUpRequest?: string;
  followUpResponseExpirationDate?: string;
  submissionDate: string;
  followUpResponse?: string;
  attachments?: AttachedFile[];
}
