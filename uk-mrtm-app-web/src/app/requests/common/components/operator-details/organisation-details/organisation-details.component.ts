import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import {
  ButtonDirective,
  CheckboxComponent,
  CheckboxesComponent,
  FieldsetDirective,
  LegendDirective,
  TextInputComponent,
} from '@netz/govuk-components';

import { REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY } from '@requests/+state';
import {
  OPERATOR_DETAILS_SUB_TASK,
  operatorDetailsMap,
  OperatorDetailsWizardStep,
} from '@requests/common/components/operator-details';
import {
  addPartnerFormControl,
  organisationDetailsFormProvider,
} from '@requests/common/components/operator-details/organisation-details/organisation-details.form-provider';
import { OrganisationDetailsTitlePipe } from '@requests/common/components/operator-details/organisation-details/organisation-details-title.pipe';
import { TASK_FORM } from '@requests/common/task-form.token';
import { LocationStateFormComponent, MultipleFileInputComponent, WizardStepComponent } from '@shared/components';
import { AddAnotherDirective } from '@shared/directives';
import { OrganisationDetailsAddressTitlePipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-organisation-details',
  imports: [
    LocationStateFormComponent,
    ReactiveFormsModule,
    TextInputComponent,
    WizardStepComponent,
    AddAnotherDirective,
    OrganisationDetailsTitlePipe,
    OrganisationDetailsAddressTitlePipe,
    ButtonDirective,
    MultipleFileInputComponent,
    FieldsetDirective,
    LegendDirective,
    CheckboxComponent,
    CheckboxesComponent,
  ],
  standalone: true,
  templateUrl: './organisation-details.component.html',
  providers: [organisationDetailsFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationDetailsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly commonSubtaskStepsQuery = inject(REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(RequestTaskStore);
  private readonly service = inject(TaskService);

  readonly formGroup = inject<FormGroup>(TASK_FORM);
  readonly operatorDetailsMap = operatorDetailsMap;
  readonly operatorDetails = this.store.select(this.commonSubtaskStepsQuery.selectOperatorDetails)();
  readonly downloadUrl = this.store.select(requestTaskQuery.selectTasksDownloadUrl)();

  get partnersCtrl(): FormArray {
    return this.formGroup.get('partners') as FormArray;
  }

  get sameAsContactAddressCtrl(): FormControl {
    return this.formGroup.get('sameAsContactAddress') as FormControl;
  }

  get registeredAddressCtrl(): FormGroup {
    return this.formGroup.get('registeredAddress') as FormGroup;
  }

  ngOnInit(): void {
    this.sameAsContactAddressCtrl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.registeredAddressCtrl.reset(value?.includes(true) ? this.operatorDetails?.contactAddress : null);
    });
  }

  addPartner(): void {
    this.partnersCtrl.push(addPartnerFormControl());
  }

  removePartner(index: number): void {
    this.partnersCtrl.removeAt(index);
  }

  onSubmit() {
    this.service
      .saveSubtask(
        OPERATOR_DETAILS_SUB_TASK,
        OperatorDetailsWizardStep.OPERATOR_DETAILS_ORGANISATION_DETAILS,
        this.route,
        this.formGroup.value,
      )
      .subscribe();
  }
}
