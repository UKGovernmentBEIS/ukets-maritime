import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { batchVariationsQuery, BatchVariationStore } from '@batch-variations/+state';
import { SubmitWizardSteps, WIZARD_STEP_CHECK_MAP } from '@batch-variations/submit/submit.helpers';

export const canActivateStep =
  (wizardStep: SubmitWizardSteps): CanActivateFn =>
  (route) => {
    const store = inject(BatchVariationStore);
    const batchVariation = store.select(batchVariationsQuery.selectCurrentItem)();

    return (
      WIZARD_STEP_CHECK_MAP[wizardStep](batchVariation) ||
      createUrlTreeFromSnapshot(
        route,
        wizardStep === SubmitWizardSteps.SUMMARY ? [SubmitWizardSteps.EMP_LOG] : ['../', SubmitWizardSteps.EMP_LOG],
      )
    );
  };
