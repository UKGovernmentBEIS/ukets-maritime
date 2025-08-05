import { AttachedFile } from '@shared/types/attached-file.interface';

export interface RfiResponse {
  operatorFiles: AttachedFile[];
  regulatorFiles: AttachedFile[];
  questions: string[];
  answers: string[];
}
