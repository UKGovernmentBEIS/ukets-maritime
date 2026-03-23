import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpRegisteredOwner } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { CheckboxComponent, CheckboxesComponent, LabelDirective } from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { MANDATE_SUB_TASK, MandateWizardStep } from '@requests/common/emp/subtasks/mandate';
import { provideMandateResponsibilityDeclarationFormProvider } from '@requests/common/emp/subtasks/mandate/mandate-responsibility-declaration/mandate-responsibility-declaration.form-provider';
import { MandateResponsibilityDeclarationFormGroupType } from '@requests/common/emp/subtasks/mandate/mandate-responsibility-declaration/mandate-responsibility-declaration.types';
import { mandateMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';
import { MandateRegisteredOwnersListSummaryTemplateComponent } from '@shared/components/summaries/emp/mandate/mandate-registered-owners-list-summary-template';

@Component({
  selector: 'mrtm-mandate-responsibility-declaration',
  standalone: true,
  imports: [
    WizardStepComponent,
    ReactiveFormsModule,
    CheckboxesComponent,
    CheckboxComponent,
    LabelDirective,
    MandateRegisteredOwnersListSummaryTemplateComponent,
  ],
  providers: [provideMandateResponsibilityDeclarationFormProvider],
  templateUrl: './mandate-responsibility-declaration.component.html',
  styleUrl: './mandate-responsibility-declaration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MandateResponsibilityDeclarationComponent {
  protected readonly form: FormGroup<MandateResponsibilityDeclarationFormGroupType> = inject(TASK_FORM);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService);

  readonly wizardMap = mandateMap;
  readonly registeredOwners: Signal<Array<EmpRegisteredOwner>> = this.store.select(
    empCommonQuery.selectMandateRegisteredOwners,
  );

  readonly operatorName: Signal<string> = computed(
    () => this.store.select(empCommonQuery.selectOperatorDetails)()?.operatorName,
  );

  onSubmit(): void {
    this.service
      .saveSubtask(MANDATE_SUB_TASK, MandateWizardStep.RESPONSIBILITY_DECLARATION, this.activatedRoute, this.form.value)
      .subscribe();
  }
}
