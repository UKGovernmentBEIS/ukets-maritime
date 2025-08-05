import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { aerCommonQuery } from '@requests/common/aer/+state';
import {
  AER_REDUCTION_CLAIM_SUB_TASK,
  ReductionClaimWizardStep,
} from '@requests/common/aer/subtasks/reduction-claim/reduction-claim.helpers';

export class ReductionClaimFlowManager extends WizardFlowManager {
  public readonly subtask: string = AER_REDUCTION_CLAIM_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    const reductionClaim = this.store.select(aerCommonQuery.selectReductionClaim)();

    switch (currentStep) {
      case ReductionClaimWizardStep.EXIST:
        return of(reductionClaim?.exist ? `../${ReductionClaimWizardStep.DETAILS}` : '../');
      case ReductionClaimWizardStep.DETAILS:
        return of(ReductionClaimWizardStep.SUMMARY);
      case ReductionClaimWizardStep.DELETE_FUEL_PURCHASE:
        return of('./');
      case ReductionClaimWizardStep.FUEL_PURCHASE:
        return of(`../`);
      default:
        return of('../../');
    }
  }
}
