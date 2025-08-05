import { FormControl } from '@angular/forms';

import { OperatorImprovementResponse } from '@mrtm/api';

export type RespondToRecommendationFormModel = Pick<
  OperatorImprovementResponse,
  'isAddressed' | 'addressedDate' | 'addressedDescription'
> & { key: string };

export type RespondToRecommendationFormGroup = Record<keyof RespondToRecommendationFormModel, FormControl>;
