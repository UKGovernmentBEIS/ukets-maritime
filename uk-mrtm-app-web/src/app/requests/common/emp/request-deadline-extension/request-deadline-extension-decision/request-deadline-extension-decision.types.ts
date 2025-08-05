import { FormControl } from '@angular/forms';

import { RdeDecisionPayload, RdeForceDecisionPayload } from '@mrtm/api';

export type RequestDeadlineExtensionDecisionFormModel = Record<
  keyof (RdeForceDecisionPayload & RdeDecisionPayload),
  FormControl
>;
