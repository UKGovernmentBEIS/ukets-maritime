import { FormControl, FormGroup } from '@angular/forms';

import { ManageGuidanceDocumentDTO } from '@guidance/guidance.types';

export type ManageDocumentsFormGroupModel = FormGroup<Record<keyof ManageGuidanceDocumentDTO, FormControl>>;
