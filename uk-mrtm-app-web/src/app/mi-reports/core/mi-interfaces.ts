import { MiReportResult } from '@mrtm/api';

export interface ExtendedMiReportResult<TData = unknown> extends MiReportResult {
  results?: Array<TData>;
}
