import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { filter, map, take } from 'rxjs';

import { selectSubmissionErrors } from '@service-access/verifiers/+state/verifier-user.selectors';
import { VerifierUserStore } from '@service-access/verifiers/+state/verifier-user.store';
import {
  VERIFIER_USER_ADD_FORM,
  verifierUserAddFormProvider,
} from '@service-access/verifiers/verifier-user-add/verifier-user-add.form-provider';
import { UserAccountFormComponent, WizardStepComponent } from '@shared/components';
import { isNil } from '@shared/utils';

@Component({
  selector: 'mrtm-verifier-user-add',
  imports: [WizardStepComponent, UserAccountFormComponent, ReactiveFormsModule, AsyncPipe],
  standalone: true,
  templateUrl: './verifier-user-add.component.html',
  providers: [verifierUserAddFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifierUserAddComponent implements AfterViewInit {
  public readonly formGroup: FormGroup = inject<UntypedFormGroup>(VERIFIER_USER_ADD_FORM);
  private readonly store: VerifierUserStore = inject(VerifierUserStore);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  public readonly wizardStep = viewChild(WizardStepComponent, { read: ElementRef });
  private readonly submissionErrors$ = this.store.pipe(selectSubmissionErrors);
  public readonly formHint$ = this.activatedRoute.paramMap.pipe(
    map((params) => {
      const userType = params.get('userType');

      return userType === 'verifier_admin' ? 'Add a new verifier admin' : 'Add a new user';
    }),
    take(1),
  );

  public handleSubmit(): void {
    this.store.setNewUserAuthority(this.formGroup.value);

    this.router.navigate(['summary'], {
      relativeTo: this.activatedRoute,
      queryParams: this.activatedRoute.snapshot.queryParams,
    });
  }

  public ngAfterViewInit(): void {
    this.submissionErrors$
      .pipe(
        take(1),
        filter((errors) => !isNil(errors) && errors.length > 0),
      )
      .subscribe((submissionErrors) => {
        for (const { control, validationErrors } of submissionErrors) {
          this.formGroup.get(control).setErrors(validationErrors);
        }
        this.wizardStep().nativeElement.querySelector('button[type="submit"]').click();

        this.changeDetectorRef.detectChanges();
        this.store.setSubmissionErrors(null);
      });
  }
}
