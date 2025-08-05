import { AttachedFile } from '@shared/types/attached-file.interface';

export interface RfiSubmitted {
  officialNotice: AttachedFile[];
  attachments: AttachedFile[];
  questions: string[];
  operators: string[];
  signatory: string;
  deadline: string;
}
