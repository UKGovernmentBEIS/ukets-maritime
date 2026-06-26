import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { map, of, take } from 'rxjs';

import { ForgotPasswordService } from '@mrtm/api';

import { catchBadRequest, ErrorCodes } from '@netz/common/error';

import { ResetPasswordStore } from '@forgot-password/store/reset-password.store';
import { PasswordComponent, WizardStepComponent } from '@shared/components';
import { PASSWORD_FORM, passwordFormProvider } from '@shared/providers';

@Component({
  selector: 'mrtm-reset-password',
  imports: [ReactiveFormsModule, PasswordComponent, WizardStepComponent],
  standalone: true,
  templateUrl: './reset-password.component.html',
  providers: [passwordFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent implements OnInit {
  protected readonly form = inject<UntypedFormGroup>(PASSWORD_FORM);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(ResetPasswordStore);
  private readonly forgotPasswordService = inject(ForgotPasswordService);

  token: string;

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.forgotPasswordService
      .verifyToken({ token: this.token })
      .pipe(
        map((emailDTO) => {
          this.store.setState({ ...this.store.getState(), email: emailDTO.email });
        }),
        map(() => ({ url: 'success' })),
        catchBadRequest([ErrorCodes.EMAIL1001, ErrorCodes.TOKEN1001], (res) =>
          of({ url: 'invalid-link', code: res.error.code }),
        ),
      )
      .subscribe(({ code, url }: { url: string; code: string }) => {
        if (url !== 'success') {
          code === ErrorCodes.TOKEN1001
            ? this.router.navigate(['error', '404'])
            : this.router.navigate(['forgot-password', url]);
        }
      });

    this.store
      .select('password')
      .pipe(
        map((password) => this.form.patchValue({ password, validatePassword: password })),
        take(1),
      )
      .subscribe();
  }

  onSubmit(): void {
    this.store.setState({ ...this.store.getState(), password: this.form.get('password').value, token: this.token });

    this.router.navigate(['../otp'], {
      relativeTo: this.route,
    });
  }
}
