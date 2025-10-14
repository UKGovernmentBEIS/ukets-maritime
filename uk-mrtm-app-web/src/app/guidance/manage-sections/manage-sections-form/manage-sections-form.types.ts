import { FormControl, FormGroup } from '@angular/forms';

import { SaveGuidanceSectionDTO } from '@mrtm/api';

export type ManageSectionsFormGroupModel = FormGroup<Record<keyof SaveGuidanceSectionDTO, FormControl>>;
