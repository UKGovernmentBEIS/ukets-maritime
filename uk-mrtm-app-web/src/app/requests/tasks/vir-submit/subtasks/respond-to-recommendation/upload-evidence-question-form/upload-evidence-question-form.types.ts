import { FormControl } from '@angular/forms';

import { OperatorImprovementResponse } from '@mrtm/api';

export type UploadEvidenceQuestionFormModel = Pick<OperatorImprovementResponse, 'uploadEvidence'> & { key: string };

export type UploadEvidenceQuestionFormGroup = Record<keyof UploadEvidenceQuestionFormModel, FormControl>;
