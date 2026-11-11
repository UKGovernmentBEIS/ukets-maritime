import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';

import { AuthStore, selectUserId } from '@netz/common/auth';

import { VerifierUserStore } from '@service-access/verifiers/+state/verifier-user.store';
import {
  VERIFIER_USER_EDIT_FORM,
  verifierUserEditFormProvider,
} from '@service-access/verifiers/verifier-user-edit/verifier-user-edit.form-provider';
import { UserAccountFormComponent, WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-verifier-user-edit',
  imports: [UserAccountFormComponent, WizardStepComponent, ReactiveFormsModule],
  standalone: true,
  templateUrl: './verifier-user-edit.component.html',
  providers: [verifierUserEditFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifierUserEditComponent {
  public readonly formGroup: FormGroup = inject<UntypedFormGroup>(VERIFIER_USER_EDIT_FORM);
  private readonly store: VerifierUserStore = inject(VerifierUserStore);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly authStore: AuthStore = inject(AuthStore);

  handleSubmit(): void {
    const routeUserId = this.activatedRoute.snapshot.paramMap.get('userId');
    const currentUserId = this.authStore.select(selectUserId)();

    (this.formGroup.dirty
      ? this.store.editUserAuthority(routeUserId, this.formGroup.getRawValue(), currentUserId === routeUserId)
      : of<any>(true)
    ).subscribe(() => {
      this.router.navigate(['../'], {
        relativeTo: this.activatedRoute,
        queryParams: this.formGroup.dirty ? { saveCompleted: true } : undefined,
        queryParamsHandling: 'merge',
      });
    });
  }
}
