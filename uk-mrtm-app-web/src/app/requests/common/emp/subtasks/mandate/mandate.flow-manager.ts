import { Observable, of } from 'rxjs';

import { EmissionsMonitoringPlan } from '@mrtm/api';

import { WizardFlowManager } from '@netz/common/forms';

import { empCommonQuery } from '@requests/common/emp/+state';
import { MANDATE_SUB_TASK, MandateWizardStep } from '@requests/common/emp/subtasks/mandate/mandate.helper';

export class MandateFlowManager extends WizardFlowManager {
  public readonly subtask: keyof EmissionsMonitoringPlan = MANDATE_SUB_TASK;

  public nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case MandateWizardStep.RESPONSIBILITY:
        return this.store.select(empCommonQuery.selectMandate)().exist
          ? of(`../${MandateWizardStep.REGISTERED_OWNERS}`)
          : of(`../`);
      case MandateWizardStep.REGISTERED_OWNERS_FORM_ADD:
        return of('../');
      case MandateWizardStep.REGISTERED_OWNERS_FORM_EDIT:
        return of('../../');
      case MandateWizardStep.DELETE_REGISTERED_OWNER:
        return of('.');
      case MandateWizardStep.UPLOAD_OWNERS:
        return of(`../${MandateWizardStep.REGISTERED_OWNERS}`);
      case MandateWizardStep.RESPONSIBILITY_DECLARATION:
        return of(MandateWizardStep.SUMMARY);
      default:
        return of('../../');
    }
  }
}
