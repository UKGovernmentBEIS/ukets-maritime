import { RequestDetailsDTO } from '@mrtm/api';

export interface ReportGroupType {
  reportingYear: string;
  total?: string;
  items: Array<RequestDetailsDTO>;
}
