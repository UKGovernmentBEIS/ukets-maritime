import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AboutProcedureDetailsComponent, EmpProcedureFormComponent } from '@requests/common/emp/components';
import { EmpProcedureWizardStepAbstract } from '@requests/common/emp/components/emp-procedure-wizard-step.abstract-control';
import { EMISSION_SOURCES_SUB_TASK, EmissionSourcesWizardStep } from '@requests/common/emp/subtasks/emission-sources';
import { emissionSourcesCompletionFormProvider } from '@requests/common/emp/subtasks/emission-sources/emission-sources-completion/emission-sources-completion.form-provider';
import { emissionSourcesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-emission-sources-completion',
  imports: [WizardStepComponent, AboutProcedureDetailsComponent, EmpProcedureFormComponent, ReactiveFormsModule],
  standalone: true,
  templateUrl: './emission-sources-completion.component.html',
  providers: [emissionSourcesCompletionFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmissionSourcesCompletionComponent extends EmpProcedureWizardStepAbstract {
  public readonly emissionSourcesMap = emissionSourcesMap;
  public subtask = EMISSION_SOURCES_SUB_TASK;
  public step = EmissionSourcesWizardStep.LIST_COMPLETION;
}
