import { FormControl } from '@angular/forms';

import { UploadedFile } from '@shared/types';

export type UploadEvidenceFormModel = { files: UploadedFile[]; key: string };

export type UploadEvidenceFormGroup = Record<keyof UploadEvidenceFormModel, FormControl>;
