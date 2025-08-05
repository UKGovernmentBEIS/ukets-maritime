import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { RESPOND_TO_RECOMMENDATION_SUBTASK } from '@requests/common/vir/subtasks/respond-to-recommendation/respond-to-recommendation.helpers';
import { VirRespondToRecommendationWizardStep } from '@requests/tasks/vir-submit/subtasks/respond-to-recommendation/respond-to-recommendation.helpers';

export class RespondToRecommendationFlowManager extends WizardFlowManager {
  subtask: string = RESPOND_TO_RECOMMENDATION_SUBTASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case VirRespondToRecommendationWizardStep.RESPOND_TO:
        return of(`../${VirRespondToRecommendationWizardStep.UPLOAD_EVIDENCE_QUESTION}`);
      case VirRespondToRecommendationWizardStep.UPLOAD_EVIDENCE_QUESTION:
        return of(`../${VirRespondToRecommendationWizardStep.UPLOAD_EVIDENCE_FORM}`);
      case VirRespondToRecommendationWizardStep.UPLOAD_EVIDENCE_FORM:
        return of(`../`);
      case VirRespondToRecommendationWizardStep.SUMMARY:
        return of('../../../');
      default:
        return of('../../');
    }
  }
}
