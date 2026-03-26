import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AboutProcedureDetailsComponent, EmpProcedureFormComponent } from '@requests/common/emp/components';
import { EmpProcedureWizardStepAbstract } from '@requests/common/emp/components/emp-procedure-wizard-step.abstract-control';
import { GREENHOUSE_GAS_SUB_TASK, GreenhouseGasWizardStep } from '@requests/common/emp/subtasks/greenhouse-gas';
import { greenhouseGasCrossChecksFormProvider } from '@requests/common/emp/subtasks/greenhouse-gas/greenhouse-gas-cross-checks/greenhouse-gas-cross-checks.form-provider';
import { greenhouseGasMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-greenhouse-gas-cross-checks',
  imports: [WizardStepComponent, AboutProcedureDetailsComponent, EmpProcedureFormComponent, ReactiveFormsModule],
  standalone: true,
  templateUrl: './greenhouse-gas-cross-checks.component.html',
  providers: [greenhouseGasCrossChecksFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreenhouseGasCrossChecksComponent extends EmpProcedureWizardStepAbstract {
  public readonly greenhouseGasMap = greenhouseGasMap;
  public subtask = GREENHOUSE_GAS_SUB_TASK;
  public step = GreenhouseGasWizardStep.CROSS_CHECK;
}
