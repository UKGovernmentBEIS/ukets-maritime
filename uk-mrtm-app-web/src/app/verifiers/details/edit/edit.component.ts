import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';

import { AuthStore, selectUserId } from '@netz/common/auth';

import { UserAccountFormComponent, WizardStepComponent } from '@shared/components';
import { VerifierUserStore } from '@verifiers/+state/verifier-user.store';
import { EDIT_USER_AUTHORITY_PROVIDER, editFormProvider } from '@verifiers/details/edit/edit.form-provider';

@Component({
  selector: 'mrtm-edit',
  standalone: true,
  imports: [UserAccountFormComponent, WizardStepComponent, ReactiveFormsModule],
  providers: [editFormProvider],
  templateUrl: './edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComponent {
  public readonly formGroup: FormGroup = inject<UntypedFormGroup>(EDIT_USER_AUTHORITY_PROVIDER);
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
