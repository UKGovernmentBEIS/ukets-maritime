import { InjectionToken } from '@angular/core';

import { VariationRegulatorDecisionFormModel } from '@requests/tasks/emp-variation-regulator/components/variation-regulator-decision/variation-regulator-decision-form-model.type';

export const VARIATION_REGULATOR_DECISION_FORM = new InjectionToken<VariationRegulatorDecisionFormModel>(
  'Variation regulator decision form',
);
