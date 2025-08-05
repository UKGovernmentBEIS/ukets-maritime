import { FormControl } from '@angular/forms';

import { RegulatorReviewResponse } from '@mrtm/api';

export type ReportSummaryFormModel = Pick<RegulatorReviewResponse, 'reportSummary'>;
export type ReportSummaryFormGroupModel = Record<keyof ReportSummaryFormModel, FormControl>;
