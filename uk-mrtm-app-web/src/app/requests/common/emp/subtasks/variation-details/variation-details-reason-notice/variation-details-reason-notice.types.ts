import { FormControl } from '@angular/forms';

import { EmpVariationRegulatorLedReason } from '@mrtm/api';

export type EmpVariationDetailsReasonNoticeFormModel = Record<
  keyof Omit<EmpVariationRegulatorLedReason, 'summary'>,
  FormControl
>;
