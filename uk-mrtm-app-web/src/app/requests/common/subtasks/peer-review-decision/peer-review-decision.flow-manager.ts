import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import {
  PEER_REVIEW_DECISION_SUB_TASK,
  PeerReviewWizardStep,
} from '@requests/common/subtasks/peer-review-decision/peer-review-decision.helper';

export class PeerReviewDecisionFlowManager extends WizardFlowManager {
  override subtask = PEER_REVIEW_DECISION_SUB_TASK;

  private readonly wizardStepMap: Record<PeerReviewWizardStep, string> = {
    [PeerReviewWizardStep.DECISION]: PeerReviewWizardStep.SUMMARY,
    [PeerReviewWizardStep.SUMMARY]: PeerReviewWizardStep.SUCCESS,
    [PeerReviewWizardStep.SUCCESS]: '../../',
  };

  nextStepPath(currentStep: string): Observable<string> {
    return of(this.wizardStepMap[currentStep] ?? '../../');
  }
}
