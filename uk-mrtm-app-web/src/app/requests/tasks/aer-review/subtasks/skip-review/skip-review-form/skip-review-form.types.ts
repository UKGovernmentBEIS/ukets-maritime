import { FormControl, FormGroup } from '@angular/forms';

import { AerSkipReviewDecision } from '@mrtm/api';

export type SkipReviewFormModel = AerSkipReviewDecision;

export type SkipReviewFormGroupModel = FormGroup<Record<keyof SkipReviewFormModel, FormControl>>;
