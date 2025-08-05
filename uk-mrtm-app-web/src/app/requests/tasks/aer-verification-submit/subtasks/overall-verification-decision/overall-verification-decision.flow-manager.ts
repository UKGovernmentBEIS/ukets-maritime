import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { OVERALL_VERIFICATION_DECISION_SUB_TASK, OverallVerificationDecisionStep } from '@requests/common/aer';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export class OverallVerificationDecisionFlowManager extends WizardFlowManager {
  readonly subtask = OVERALL_VERIFICATION_DECISION_SUB_TASK;
  private readonly overallDecision = this.store.select(aerVerificationSubmitQuery.selectOverallVerificationDecision);

  nextStepPath(currentStep: string): Observable<string> {
    const decisionType = this.overallDecision()?.type;

    switch (currentStep) {
      case OverallVerificationDecisionStep.ASSESSMENT:
        if (decisionType === 'VERIFIED_AS_SATISFACTORY') {
          return of(OverallVerificationDecisionStep.SUMMARY);
        } else if (decisionType === 'VERIFIED_AS_SATISFACTORY_WITH_COMMENTS') {
          return of(`../${OverallVerificationDecisionStep.VERIFIED_WITH_COMMENTS_LIST}`);
        } else if (decisionType === 'NOT_VERIFIED') {
          return of(`../${OverallVerificationDecisionStep.NOT_VERIFIED_REASONS}`);
        }
        break;

      case OverallVerificationDecisionStep.VERIFIED_WITH_COMMENTS_FORM_ADD:
        return of(`../${OverallVerificationDecisionStep.VERIFIED_WITH_COMMENTS_LIST}`);

      case OverallVerificationDecisionStep.VERIFIED_WITH_COMMENTS_FORM_EDIT:
      case OverallVerificationDecisionStep.VERIFIED_WITH_COMMENTS_DELETE:
        return of(`../../${OverallVerificationDecisionStep.VERIFIED_WITH_COMMENTS_LIST}`);

      case OverallVerificationDecisionStep.VERIFIED_WITH_COMMENTS_LIST:
      case OverallVerificationDecisionStep.NOT_VERIFIED_REASONS:
        return of(OverallVerificationDecisionStep.SUMMARY);

      default:
        return of('../../');
    }
  }
}
