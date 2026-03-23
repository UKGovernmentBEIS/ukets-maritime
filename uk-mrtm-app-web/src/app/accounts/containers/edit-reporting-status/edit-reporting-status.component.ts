import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AccountReportingStatusHistoryCreationDTO } from '@mrtm/api';

import { GovukValidators, LinkDirective, TextareaComponent, WarningTextComponent } from '@netz/govuk-components';

import { OperatorAccountsStore } from '@accounts/store';
import { ReportingStatusListItem } from '@accounts/types';
import { WizardStepComponent } from '@shared/components';

interface FormModel {
  status: FormControl<AccountReportingStatusHistoryCreationDTO['status']>;
  reason: FormControl<string>;
}

@Component({
  selector: 'mrtm-edit-reporting-status',
  templateUrl: './edit-reporting-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    WizardStepComponent,
    TextareaComponent,
    LinkDirective,
    RouterLink,
    ReactiveFormsModule,
    WarningTextComponent,
  ],
})
export class EditReportingStatusComponent {
  private readonly store = inject(OperatorAccountsStore);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  public readonly currentStatus = this.store.getState().currentAccount?.reportingStatus?.currentStatus;
  public readonly upsertStatus = this.store.getState().currentAccount?.reportingStatus?.upsertStatus;

  public readonly headerMap: Record<ReportingStatusListItem['status'], string> = {
    REQUIRED_TO_REPORT: `Explain why the operator is exempt from reporting for ${this.currentStatus?.year}`,
    EXEMPT: `Explain why the operator needs to report for ${this.currentStatus?.year}`,
  };

  maxReasonLength = 10000;
  form: FormGroup<FormModel> = this.fb.group<FormModel>({
    status: new FormControl(this.currentStatus?.status === 'EXEMPT' ? 'REQUIRED_TO_REPORT' : 'EXEMPT'),
    reason: new FormControl(this.upsertStatus?.reason, {
      validators: [
        GovukValidators.required('Enter a comment'),
        GovukValidators.maxLength(this.maxReasonLength, `Enter up to ${this.maxReasonLength} characters`),
      ],
    }),
  });

  onSubmit() {
    this.store.editReportingStatus(this.form.value as AccountReportingStatusHistoryCreationDTO);
    this.router.navigate(['./summary'], { relativeTo: this.activatedRoute });
  }
}
