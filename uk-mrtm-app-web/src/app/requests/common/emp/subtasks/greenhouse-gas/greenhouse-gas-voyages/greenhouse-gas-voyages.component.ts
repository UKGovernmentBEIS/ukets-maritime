import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AboutProcedureDetailsComponent, EmpProcedureFormComponent } from '@requests/common/emp/components';
import { EmpProcedureWizardStepAbstract } from '@requests/common/emp/components/emp-procedure-wizard-step.abstract-control';
import { GREENHOUSE_GAS_SUB_TASK, GreenhouseGasWizardStep } from '@requests/common/emp/subtasks/greenhouse-gas';
import { greenhouseGasVoyagesFormProvider } from '@requests/common/emp/subtasks/greenhouse-gas/greenhouse-gas-voyages/greenhouse-gas-voyages.form-provider';
import { greenhouseGasMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-greenhouse-gas-voyages',
  standalone: true,
  imports: [WizardStepComponent, AboutProcedureDetailsComponent, EmpProcedureFormComponent, ReactiveFormsModule],
  providers: [greenhouseGasVoyagesFormProvider],
  templateUrl: './greenhouse-gas-voyages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreenhouseGasVoyagesComponent extends EmpProcedureWizardStepAbstract {
  public readonly greenhouseGasMap = greenhouseGasMap;
  public subtask = GREENHOUSE_GAS_SUB_TASK;
  public step = GreenhouseGasWizardStep.VOYAGES;
}
