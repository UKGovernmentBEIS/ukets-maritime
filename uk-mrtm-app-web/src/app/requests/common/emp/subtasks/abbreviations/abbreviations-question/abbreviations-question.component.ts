import { ChangeDetectionStrategy, Component, effect, inject, Signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import {
  ButtonDirective,
  FieldsetDirective,
  LegendDirective,
  RadioComponent,
  RadioOptionComponent,
  TextInputComponent,
} from '@netz/govuk-components';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { ABBREVIATIONS_SUB_TASK, AbbreviationsWizardStep } from '@requests/common/emp/subtasks/abbreviations';
import {
  abbreviationsQuestionFormProvider,
  addAbbreviationDefinitionGroup,
} from '@requests/common/emp/subtasks/abbreviations/abbreviations-question/abbreviations-question.form-provider';
import { abbreviationsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-abbreviations-question',
  standalone: true,
  imports: [
    WizardStepComponent,
    ReactiveFormsModule,
    RadioComponent,
    TextInputComponent,
    RadioOptionComponent,
    FieldsetDirective,
    LegendDirective,
    ButtonDirective,
  ],
  templateUrl: './abbreviations-question.component.html',
  providers: [abbreviationsQuestionFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbbreviationsQuestionComponent {
  protected readonly form: UntypedFormGroup = inject(TASK_FORM);
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly wizardStepComponent = viewChild.required(WizardStepComponent);

  protected readonly abbreviationsMap = abbreviationsMap;
  existCtrlValue: Signal<boolean> = toSignal(this.existCtrl.valueChanges, {
    initialValue: this.existCtrl.value,
  });

  constructor() {
    effect(() => {
      if (this.existCtrlValue() === true) {
        if (this.abbrDefFormArray.length === 0) {
          this.addAbbrDefFormGroup();
          this.form.updateValueAndValidity({ emitEvent: true });
        }
      } else {
        this.abbrDefFormArray.clear({ emitEvent: true });
        this.form.updateValueAndValidity({ emitEvent: true });
      }
    });
  }

  get existCtrl(): UntypedFormControl {
    return this.form.get('exist') as UntypedFormControl;
  }

  get abbrDefFormArray(): UntypedFormArray {
    return this.form.get('abbreviationDefinitions') as UntypedFormArray;
  }

  addAbbrDefFormGroup() {
    if (this.form.valid && this.form.touched) {
      this.wizardStepComponent().isSummaryDisplayedSubject.next(false);
    }
    const abbreviationDefinitionsFormArray = this.abbrDefFormArray;
    abbreviationDefinitionsFormArray.push(addAbbreviationDefinitionGroup());
    abbreviationDefinitionsFormArray.at(abbreviationDefinitionsFormArray.length - 1);
  }

  removeAbbrDefFormGroup(index: number) {
    this.abbrDefFormArray.removeAt(index);
  }

  onSubmit() {
    this.service
      .saveSubtask(ABBREVIATIONS_SUB_TASK, AbbreviationsWizardStep.ABBREVIATIONS_QUESTION, this.route, this.form.value)
      .subscribe();
  }
}
