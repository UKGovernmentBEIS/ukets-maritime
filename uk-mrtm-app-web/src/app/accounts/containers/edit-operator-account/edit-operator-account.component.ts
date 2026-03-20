import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { switchMap, take, tap } from 'rxjs';

import { LinkDirective } from '@netz/govuk-components';

import { OperatorAccountFormComponent } from '@accounts/components';
import {
  EDIT_OPERATOR_ACCOUNT_FORM,
  editOperatorAccountFormProvider,
} from '@accounts/containers/edit-operator-account/edit-operator-account.form-provider';
import { OperatorAccountsStore, selectAccount } from '@accounts/store';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-edit-operator-account',
  imports: [ReactiveFormsModule, WizardStepComponent, RouterLink, OperatorAccountFormComponent, LinkDirective],
  standalone: true,
  templateUrl: './edit-operator-account.component.html',
  providers: [editOperatorAccountFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditOperatorAccountComponent {
  public form = inject<FormGroup>(EDIT_OPERATOR_ACCOUNT_FORM);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly store: OperatorAccountsStore = inject(OperatorAccountsStore);

  public handleSubmit(): void {
    if (this.form.valid) {
      this.store
        .pipe(
          selectAccount,
          take(1),
          tap((account) => {
            this.store.setCurrentAccount({
              account: {
                ...account,
                ...this.form.getRawValue(),
              },
            });
          }),
          switchMap(() => this.activatedRoute.params),
          switchMap((params) => this.store.editAccount(params['accountId'])),
        )
        .subscribe(() => {
          this.router.navigate(['../'], { relativeTo: this.activatedRoute });
        });
    }
  }
}
