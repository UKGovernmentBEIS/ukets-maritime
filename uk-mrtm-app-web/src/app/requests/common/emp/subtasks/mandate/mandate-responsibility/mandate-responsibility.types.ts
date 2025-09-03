import { FormControl } from '@angular/forms';

import { EmpMandate } from '@mrtm/api';

export type MandateResponsibilityFormModel = Pick<EmpMandate, 'exist'>;

export type MandateResponsibilityFormGroupModel = Record<keyof MandateResponsibilityFormModel, FormControl>;
