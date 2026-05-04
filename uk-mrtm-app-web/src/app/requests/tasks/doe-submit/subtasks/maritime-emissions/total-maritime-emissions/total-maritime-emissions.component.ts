import { I18nSelectPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { RadioComponent, RadioOptionComponent, TextareaComponent, TextInputComponent } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import { doeTotalMaritimeEmissionsMap, maritimeEmissionsMap } from '@requests/common/doe';
import { DoeTaskPayload } from '@requests/tasks/doe-submit/doe-submit.types';
import {
  MARITIME_EMISSIONS_SUB_TASK,
  MaritimeEmissionsWizardStep,
} from '@requests/tasks/doe-submit/subtasks/maritime-emissions';
import {
  TotalMaritimeEmissionsFormModel,
  totalMaritimeEmissionsFormProvider,
} from '@requests/tasks/doe-submit/subtasks/maritime-emissions/total-maritime-emissions/total-maritime-emissions.form-provider';
import { MultipleFileInputComponent, WizardStepComponent } from '@shared/components';
import { determinationTypeMap } from '@shared/types/maritime-emissions.types';

@Component({
  selector: 'mrtm-total-maritime-emissions',
  imports: [
    WizardStepComponent,
    ReactiveFormsModule,
    RadioComponent,
    RadioOptionComponent,
    TextareaComponent,
    TextInputComponent,
    MultipleFileInputComponent,
    I18nSelectPipe,
  ],
  standalone: true,
  templateUrl: './total-maritime-emissions.component.html',
  providers: [totalMaritimeEmissionsFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalMaritimeEmissionsComponent {
  protected readonly form: FormGroup<TotalMaritimeEmissionsFormModel> = inject(TASK_FORM);
  private readonly service: TaskService<DoeTaskPayload> = inject(TaskService<DoeTaskPayload>);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  readonly downloadUrl = this.store.select(requestTaskQuery.selectTasksDownloadUrl);
  readonly maritimeEmissionsMap = maritimeEmissionsMap;
  readonly doeTotalMaritimeEmissionsMap = doeTotalMaritimeEmissionsMap;
  readonly determinationTypeMap = determinationTypeMap;
  readonly determinationTypeOptions: string[] = Object.keys(determinationTypeMap);

  onSubmit() {
    this.service
      .saveSubtask(
        MARITIME_EMISSIONS_SUB_TASK,
        MaritimeEmissionsWizardStep.TOTAL_MARITIME_EMISSIONS,
        this.route,
        this.form.value,
      )
      .subscribe();
  }
}
