import { EmpIssuanceDetermination, RequestActionUserInfo } from '@mrtm/api';

import { AttachedFile } from '@shared/types/attached-file.interface';

export interface EmpReviewedDto {
  empFile?: Array<AttachedFile>;
  empApplication?: {
    title?: string;
    url?: string;
  };
  determination?: EmpIssuanceDetermination;
  users?: Array<string>;
  signatory?: RequestActionUserInfo;
  officialNotice?: Array<AttachedFile>;
}
