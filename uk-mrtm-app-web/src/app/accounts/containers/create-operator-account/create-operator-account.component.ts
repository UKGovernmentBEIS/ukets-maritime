import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { LinkDirective } from '@netz/govuk-components';

import { OperatorAccountFormComponent } from '@accounts/components';
import {
  CREATE_OPERATOR_ACCOUNT_FORM,
  createOperatorAccountFormProvider,
} from '@accounts/containers/create-operator-account/create-operator-account.form-provider';
import { OperatorAccountsStore } from '@accounts/store';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-create-operator-account',
  templateUrl: './create-operator-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, WizardStepComponent, OperatorAccountFormComponent, RouterLink, LinkDirective],
  providers: [createOperatorAccountFormProvider],
})
export class CreateOperatorAccountComponent {
  public form = inject<FormGroup>(CREATE_OPERATOR_ACCOUNT_FORM);
  private readonly router: Router = inject(Router);
  private readonly activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly store: OperatorAccountsStore = inject(OperatorAccountsStore);

  public handleConfirm(): void {
    if (this.form.valid) {
      this.store.setIsInitiallySubmitted(true);
      this.store.setNewAccount(this.form.getRawValue());
      this.router.navigate(['summary'], { relativeTo: this.activeRoute });
    }
  }
}
