import { I18nSelectPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormGroup, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import {
  ConditionalContentDirective,
  RadioComponent,
  RadioOptionComponent,
  TextareaComponent,
} from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import { maritimeEmissionsMap } from '@requests/common/doe';
import { DoeTaskPayload } from '@requests/tasks/doe-submit/doe-submit.types';
import {
  MARITIME_EMISSIONS_SUB_TASK,
  MaritimeEmissionsWizardStep,
} from '@requests/tasks/doe-submit/subtasks/maritime-emissions';
import { determinationReasonFormProvider } from '@requests/tasks/doe-submit/subtasks/maritime-emissions/determination-reason/determination-reason.form-provider';
import { WizardStepComponent } from '@shared/components';
import { determineReasonTypeMap, determineReasonTypeNoticeHintMap } from '@shared/types';

@Component({
  selector: 'mrtm-determination-reason',
  imports: [
    WizardStepComponent,
    ReactiveFormsModule,
    RadioComponent,
    RadioOptionComponent,
    TextareaComponent,
    I18nSelectPipe,
    ConditionalContentDirective,
    NgTemplateOutlet,
  ],
  standalone: true,
  templateUrl: './determination-reason.component.html',
  providers: [determinationReasonFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeterminationReasonComponent implements OnInit {
  protected readonly form: UntypedFormGroup = inject(TASK_FORM);
  private readonly destroyRef = inject(DestroyRef);
  private readonly service: TaskService<DoeTaskPayload> = inject(TaskService<DoeTaskPayload>);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly maritimeEmissionsMap = maritimeEmissionsMap;
  readonly determineReasonTypeMap = determineReasonTypeMap;
  readonly determineReasonTypeNoticeHintMap = determineReasonTypeNoticeHintMap;
  readonly determineReasonTypeOptions: string[] = Object.keys(determineReasonTypeMap);

  get detailsFormGroup(): FormGroup {
    return this.form.get('details') as FormGroup;
  }

  get reasonTypeCtrl(): AbstractControl {
    return this.detailsFormGroup.get('type');
  }

  get reasonNoticeTextCtr(): AbstractControl {
    return this.detailsFormGroup.get('noticeText');
  }

  ngOnInit(): void {
    this.reasonTypeCtrl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (value) {
        this.reasonNoticeTextCtr.enable();
      } else {
        this.reasonNoticeTextCtr.disable();
      }

      this.detailsFormGroup.patchValue({
        noticeText: null,
      });
    });
  }

  onSubmit() {
    this.service
      .saveSubtask(
        MARITIME_EMISSIONS_SUB_TASK,
        MaritimeEmissionsWizardStep.DETERMINATION_REASON,
        this.route,
        this.form.value,
      )
      .subscribe();
  }
}
