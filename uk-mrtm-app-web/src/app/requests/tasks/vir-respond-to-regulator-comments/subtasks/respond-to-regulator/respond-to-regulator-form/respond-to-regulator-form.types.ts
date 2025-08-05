import { FormControl } from '@angular/forms';

import { OperatorImprovementFollowUpResponse } from '@mrtm/api';

export type RespondToRegulatorFormModel = OperatorImprovementFollowUpResponse & { key: string };

export type RespondToRegulatorFormGroupModel = Record<keyof RespondToRegulatorFormModel, FormControl>;
