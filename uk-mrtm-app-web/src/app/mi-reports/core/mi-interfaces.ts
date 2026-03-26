import { MiReportSystemResult } from '@mrtm/api';

export interface ExtendedMiReportResult<TData = unknown> extends MiReportSystemResult {
  results?: Array<TData>;
}
