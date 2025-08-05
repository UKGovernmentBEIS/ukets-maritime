import { computed } from '@angular/core';

import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { NON_COMPLIANCE_DETAILS_SUB_TASK, NonComplianceDetailsStep } from '@requests/common/non-compliance';
import { nonComplianceSubmitQuery } from '@requests/tasks/non-compliance-submit/+state';

export class NonComplianceDetailsFlowManager extends WizardFlowManager {
  readonly subtask = NON_COMPLIANCE_DETAILS_SUB_TASK;

  private readonly civilPenalty = computed(
    () => this.store.select(nonComplianceSubmitQuery.selectNonComplianceDetails)()?.civilPenalty,
  );

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case NonComplianceDetailsStep.DETAILS_FORM:
        return of(`../${NonComplianceDetailsStep.SELECTED_REQUESTS}`);

      case NonComplianceDetailsStep.SELECTED_REQUESTS:
        return of(`../${NonComplianceDetailsStep.CIVIL_PENALTY}`);

      case NonComplianceDetailsStep.CIVIL_PENALTY:
        return this.civilPenalty()
          ? of(`../${NonComplianceDetailsStep.NOTICE_OF_INTENT}`)
          : of(NonComplianceDetailsStep.SUMMARY);

      case NonComplianceDetailsStep.NOTICE_OF_INTENT:
        return of(`../${NonComplianceDetailsStep.INITIAL_PENALTY}`);

      case NonComplianceDetailsStep.INITIAL_PENALTY:
        return of(NonComplianceDetailsStep.SUMMARY);

      case NonComplianceDetailsStep.SUMMARY:
        return of('./');

      default:
        return of('../../');
    }
  }
}
