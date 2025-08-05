import { AttachedFile } from '@shared/types/attached-file.interface';

export interface FollowUpReviewDecisionDTO {
  type?: 'ACCEPTED' | 'AMENDS_NEEDED';
  requiredChanges: {
    reason?: string;
    files?: AttachedFile[];
  }[];
  notes?: string;
  dueDate?: string;
}
