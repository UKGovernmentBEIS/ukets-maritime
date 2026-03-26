import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AboutProcedureDetailsComponent, EmpProcedureFormComponent } from '@requests/common/emp/components';
import { EmpProcedureWizardStepAbstract } from '@requests/common/emp/components/emp-procedure-wizard-step.abstract-control';
import { GREENHOUSE_GAS_SUB_TASK, GreenhouseGasWizardStep } from '@requests/common/emp/subtasks/greenhouse-gas';
import { greenhouseGasQaEquipmentFormProvider } from '@requests/common/emp/subtasks/greenhouse-gas/greenhouse-gas-qa-equipment/greenhouse-gas-qa-equipment.form-provider';
import { greenhouseGasMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-greenhouse-gas-qa-equipment',
  imports: [WizardStepComponent, AboutProcedureDetailsComponent, EmpProcedureFormComponent, ReactiveFormsModule],
  standalone: true,
  templateUrl: './greenhouse-gas-qa-equipment.component.html',
  providers: [greenhouseGasQaEquipmentFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreenhouseGasQaEquipmentComponent extends EmpProcedureWizardStepAbstract {
  public readonly greenhouseGasMap = greenhouseGasMap;
  public subtask = GREENHOUSE_GAS_SUB_TASK;
  public step = GreenhouseGasWizardStep.QA_EQUIPMENT;
}
