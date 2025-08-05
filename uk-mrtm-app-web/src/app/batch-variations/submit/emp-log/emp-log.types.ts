import { FormControl, FormGroup } from '@angular/forms';

import { EmpBatchReissueRequestCreateActionPayload } from '@mrtm/api';

export type EmpLogFormModel = FormGroup<
  Record<keyof Pick<EmpBatchReissueRequestCreateActionPayload, 'summary'>, FormControl>
>;
