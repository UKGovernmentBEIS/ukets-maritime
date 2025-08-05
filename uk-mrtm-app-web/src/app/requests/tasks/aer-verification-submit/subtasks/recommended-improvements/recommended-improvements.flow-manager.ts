import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { RECOMMENDED_IMPROVEMENTS_SUB_TASK, RecommendedImprovementsStep } from '@requests/common/aer';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export class RecommendedImprovementsFlowManager extends WizardFlowManager {
  readonly subtask = RECOMMENDED_IMPROVEMENTS_SUB_TASK;

  private readonly recommendedImprovements = this.store.select(
    aerVerificationSubmitQuery.selectRecommendedImprovements,
  );

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case RecommendedImprovementsStep.EXIST_FORM:
        return this.recommendedImprovements()?.exist
          ? of(`../${RecommendedImprovementsStep.ITEMS_LIST}`)
          : of(RecommendedImprovementsStep.SUMMARY);

      case RecommendedImprovementsStep.ITEM_FORM_ADD:
        return of(`../${RecommendedImprovementsStep.ITEMS_LIST}`);

      case RecommendedImprovementsStep.ITEM_FORM_EDIT:
      case RecommendedImprovementsStep.ITEM_DELETE:
        return of(`../../${RecommendedImprovementsStep.ITEMS_LIST}`);

      case RecommendedImprovementsStep.ITEMS_LIST:
        return of(RecommendedImprovementsStep.SUMMARY);

      default:
        return of('../../');
    }
  }
}
