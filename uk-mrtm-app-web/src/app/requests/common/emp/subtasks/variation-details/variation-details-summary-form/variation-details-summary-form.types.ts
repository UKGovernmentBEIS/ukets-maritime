import { FormControl } from '@angular/forms';

import { EmpVariationRegulatorLedReason } from '@mrtm/api';

export type VariationDetailsSummaryFormGroupModel = Record<
  keyof Pick<EmpVariationRegulatorLedReason, 'summary'>,
  FormControl
>;
