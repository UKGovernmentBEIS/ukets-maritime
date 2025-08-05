import { computed, Signal } from '@angular/core';

import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { OPINION_STATEMENT_SUB_TASK, OpinionStatementStep } from '@requests/common/aer';
import { AerSiteVisitType } from '@requests/common/aer/aer.types';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export class OpinionStatementFlowManager extends WizardFlowManager {
  readonly subtask = OPINION_STATEMENT_SUB_TASK;

  private readonly siteVisitType: Signal<AerSiteVisitType> = computed(
    () => this.store.select(aerVerificationSubmitQuery.selectOpinionStatement)()?.siteVisit?.type,
  );

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case OpinionStatementStep.EMISSIONS_FORM:
        return of(`../${OpinionStatementStep.ADDITIONAL_CHANGES}`);

      case OpinionStatementStep.ADDITIONAL_CHANGES:
        return of(`../${OpinionStatementStep.SITE_VISIT_TYPE}`);

      case OpinionStatementStep.SITE_VISIT_TYPE:
        return this.siteVisitType() === 'IN_PERSON'
          ? of(`../${OpinionStatementStep.SITE_VISIT_IN_PERSON}`)
          : of(`../${OpinionStatementStep.SITE_VISIT_VIRTUAL}`);

      case OpinionStatementStep.SITE_VISIT_IN_PERSON:
      case OpinionStatementStep.SITE_VISIT_VIRTUAL:
        return of(OpinionStatementStep.SUMMARY);

      default:
        return of('../../');
    }
  }
}
