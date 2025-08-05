import { AccountReportingStatusHistoryDTO } from '@mrtm/api';

export interface ReportingStatusListItem {
  status: AccountReportingStatusHistoryDTO['status'];
  reported?: boolean;
  reason?: string;
  year: string;
  lastUpdated?: Date;
}
