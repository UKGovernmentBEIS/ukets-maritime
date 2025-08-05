import { TaskItemStatus } from '@requests/common/task-item-status';
import { AttachedFile } from '@shared/types/attached-file.interface';

export interface EmpBatchVariationDetailsDTO {
  id: string;
  requestStatus?: TaskItemStatus;
  createdBy: string;
  createdDate: string;
  signatory: string;
  summary: string;
  emitters?: number;
  report?: AttachedFile;
  documents?: Array<AttachedFile>;
}
