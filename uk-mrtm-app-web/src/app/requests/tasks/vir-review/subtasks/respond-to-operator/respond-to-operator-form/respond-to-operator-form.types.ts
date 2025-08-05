import { FormControl } from '@angular/forms';

import { RegulatorImprovementResponse } from '@mrtm/api';

export type RespondToOperatorFormModel = RegulatorImprovementResponse & { key: string };

export type RespondToOperatorFormGroupModel = Record<keyof RespondToOperatorFormModel, FormControl>;
