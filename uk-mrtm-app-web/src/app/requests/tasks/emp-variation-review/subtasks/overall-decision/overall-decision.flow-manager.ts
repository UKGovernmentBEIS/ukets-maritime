import { Observable, of } from 'rxjs';
import { isNil } from 'lodash-es';

import { WizardFlowManager } from '@netz/common/forms';

import { empVariationReviewQuery, EmpVariationReviewTaskPayload } from '@requests/common';
import { OVERALL_DECISION_SUB_TASK, OverallDecisionWizardStep } from '@requests/common/emp/subtasks/overall-decision';

export class OverallDecisionFlowManager extends WizardFlowManager {
  override subtask = OVERALL_DECISION_SUB_TASK;

  private readonly wizardStepMap: Record<
    string,
    (determination: EmpVariationReviewTaskPayload['determination']) => string
  > = {
    [OverallDecisionWizardStep.OVERALL_DECISION_ACTIONS]: () =>
      `../${OverallDecisionWizardStep.OVERALL_DECISION_QUESTION}`,
    [OverallDecisionWizardStep.OVERALL_DECISION_QUESTION]: (determination) => {
      return determination?.type === 'DEEMED_WITHDRAWN'
        ? OverallDecisionWizardStep.SUMMARY
        : `../${OverallDecisionWizardStep.OVERALL_DECISION_VARIATION_LOG}`;
    },
    [OverallDecisionWizardStep.OVERALL_DECISION_VARIATION_LOG]: () => OverallDecisionWizardStep.SUMMARY,
  };

  nextStepPath(currentStep: string): Observable<string> {
    const step = this.wizardStepMap[currentStep];
    return of(!isNil(step) ? step(this.store.select(empVariationReviewQuery.selectDetermination)()) : '../../');
  }
}
