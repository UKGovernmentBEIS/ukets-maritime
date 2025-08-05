import { FormControl } from '@angular/forms';

import { RdePayload } from '@mrtm/api';

export type RequestDeadlineExtensionModel = Pick<RdePayload, 'extensionDate' | 'deadline'>;

export type RequestDeadlineExtensionFormModel = Record<keyof RequestDeadlineExtensionModel, FormControl>;
