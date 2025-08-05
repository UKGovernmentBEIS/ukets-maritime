import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AboutProcedureDetailsComponent, EmpProcedureFormComponent } from '@requests/common/emp/components';
import { EmpProcedureWizardStepAbstract } from '@requests/common/emp/components/emp-procedure-wizard-step.abstract-control';
import { GREENHOUSE_GAS_SUB_TASK, GreenhouseGasWizardStep } from '@requests/common/emp/subtasks/greenhouse-gas';
import { greenhouseGasInformationFormProvider } from '@requests/common/emp/subtasks/greenhouse-gas/greenhouse-gas-information/greenhouse-gas-information.form-provider';
import { greenhouseGasMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-greenhouse-gas-information',
  standalone: true,
  imports: [WizardStepComponent, AboutProcedureDetailsComponent, EmpProcedureFormComponent, ReactiveFormsModule],
  providers: [greenhouseGasInformationFormProvider],
  templateUrl: './greenhouse-gas-information.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreenhouseGasInformationComponent extends EmpProcedureWizardStepAbstract {
  public readonly greenhouseGasMap = greenhouseGasMap;
  public subtask = GREENHOUSE_GAS_SUB_TASK;
  public step = GreenhouseGasWizardStep.INFORMATION;
}
