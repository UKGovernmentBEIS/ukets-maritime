import { FormControl, FormGroup } from '@angular/forms';

import { EmpBatchReissueRequestCreateActionPayload } from '@mrtm/api';

export type SignatureFormModel = FormGroup<
  Record<keyof Pick<EmpBatchReissueRequestCreateActionPayload, 'signatory'>, FormControl>
>;
