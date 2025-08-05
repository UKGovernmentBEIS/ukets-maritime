import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AccountClosure } from '@mrtm/api';

import { GovukValidators, LinkDirective, TextareaComponent } from '@netz/govuk-components';

import { AccountClosureStateService } from '@requests/tasks/account-closure/services';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-organisation-account-application-review',
  templateUrl: './account-closure-submit.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextareaComponent, ReactiveFormsModule, WizardStepComponent, LinkDirective, RouterLink],
})
export class AccountClosureSubmitComponent {
  private readonly accountClosureStateService = inject(AccountClosureStateService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  form = this.fb.group({
    reason: [
      this.accountClosureStateService.payload?.accountClosure?.reason ?? null,
      {
        validators: [
          GovukValidators.required('You must say why you are closing this account'),
          GovukValidators.maxLength(2000, 'Enter up to 2000 characters'),
        ],
        updateOn: 'change',
      },
    ],
  });

  onSubmit() {
    this.accountClosureStateService
      .saveAccountClosure({ accountClosure: this.form.value as AccountClosure })
      .subscribe(() => {
        this.router.navigate(['account-closure', 'confirmation'], { relativeTo: this.route });
      });
  }
}
