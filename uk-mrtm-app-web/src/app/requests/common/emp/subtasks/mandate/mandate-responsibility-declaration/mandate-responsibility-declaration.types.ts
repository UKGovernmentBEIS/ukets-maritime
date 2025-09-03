import { FormControl } from '@angular/forms';

import { EmpMandate } from '@mrtm/api';

export type MandateResponsibilityDeclarationFormType = Pick<EmpMandate, 'responsibilityDeclaration'>;
export type MandateResponsibilityDeclarationFormGroupType = Record<
  keyof MandateResponsibilityDeclarationFormType,
  FormControl
>;
