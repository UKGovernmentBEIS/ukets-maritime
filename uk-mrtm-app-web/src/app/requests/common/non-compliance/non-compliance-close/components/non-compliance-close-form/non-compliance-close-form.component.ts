import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { TextareaComponent, WarningTextComponent } from '@netz/govuk-components';

import { nonComplianceCloseFormProvider } from '@requests/common/non-compliance/non-compliance-close/components/non-compliance-close-form/non-compliance-close-form.form-provider';
import { NON_COMPLIANCE_CLOSE_SUCCESS_MESSAGE_PATH } from '@requests/common/non-compliance/non-compliance-close/non-compliance-close.const';
import { NonComplianceCloseService } from '@requests/common/non-compliance/non-compliance-close/non-compliance-close.service';
import { NonComplianceCloseFormGroupData } from '@requests/common/non-compliance/non-compliance-close/non-compliance-close.types';
import { TASK_FORM } from '@requests/common/task-form.token';
import { MultipleFileInputComponent, WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-non-compliance-close-form',
  standalone: true,
  imports: [
    MultipleFileInputComponent,
    TextareaComponent,
    ReactiveFormsModule,
    WizardStepComponent,
    WarningTextComponent,
  ],
  templateUrl: './non-compliance-close-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [nonComplianceCloseFormProvider],
})
export class NonComplianceCloseFormComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private store = inject(RequestTaskStore);
  private closeService = inject(NonComplianceCloseService);

  readonly formGroup = inject<FormGroup>(TASK_FORM);
  readonly downloadUrl = this.store.select(requestTaskQuery.selectTasksDownloadUrl);

  onSubmit() {
    this.closeService
      .close(this.formGroup.value as NonComplianceCloseFormGroupData)
      .subscribe(() => this.router.navigate([NON_COMPLIANCE_CLOSE_SUCCESS_MESSAGE_PATH], { relativeTo: this.route }));
  }
}
