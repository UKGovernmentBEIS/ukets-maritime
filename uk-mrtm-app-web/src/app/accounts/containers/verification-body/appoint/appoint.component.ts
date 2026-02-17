import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, filter, first, map, Observable, shareReplay, switchMap, withLatestFrom } from 'rxjs';

import { AccountVerificationBodyService, VerificationBodyNameInfoDTO } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { BusinessErrorService, catchBadRequest, catchElseRethrow, ErrorCodes, HttpStatuses } from '@netz/common/error';
import {
  ButtonDirective,
  ErrorSummaryComponent,
  GovukSelectOption,
  GovukValidators,
  SelectComponent,
  WarningTextComponent,
} from '@netz/govuk-components';

import { ConfirmationComponent } from '@accounts/containers/verification-body';
import { UnappointConfirmationComponent } from '@accounts/containers/verification-body/unappoint-confirmation/unappoint-confirmation.component';
import {
  appointedVerificationBodyError,
  changeNotAllowedVerificationBodyError,
  saveNotFoundVerificationBodyError,
  savePartiallyNotFoundOperatorError,
} from '@accounts/errors';

@Component({
  selector: 'mrtm-appoint',
  imports: [
    PageHeadingComponent,
    WarningTextComponent,
    ReactiveFormsModule,
    AsyncPipe,
    SelectComponent,
    ErrorSummaryComponent,
    ConfirmationComponent,
    PendingButtonDirective,
    ButtonDirective,
    UnappointConfirmationComponent,
  ],
  standalone: true,
  templateUrl: './appoint.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointComponent implements OnInit {
  private readonly fb = inject(UntypedFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly accountVerificationBodyService = inject(AccountVerificationBodyService);
  private readonly businessErrorService = inject(BusinessErrorService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private accountId$ = this.route.paramMap.pipe(map((paramMap) => Number(paramMap.get('accountId'))));

  form = this.fb.group({
    verificationBodyId: [null, GovukValidators.required('Select a verification body')],
  });
  activeBodies$: Observable<GovukSelectOption<number>[]>;
  isSummaryDisplayed$ = new BehaviorSubject<boolean>(false);
  appointedAccount$: Observable<GovukSelectOption<number>>;
  currentVerificationBody$: Observable<VerificationBodyNameInfoDTO> = (
    this.route.data as Observable<{
      verificationBody: VerificationBodyNameInfoDTO;
    }>
  ).pipe(map((state) => state.verificationBody));

  ngOnInit(): void {
    this.activeBodies$ = this.accountId$.pipe(
      switchMap((accountId) => this.accountVerificationBodyService.getActiveVerificationBodies(accountId)),
      map((bodies) => bodies.map((body) => ({ text: body.name, value: body.id }))),
      withLatestFrom(this.currentVerificationBody$),
      map(([bodies, currentVerificationBody]) =>
        currentVerificationBody ? [{ text: 'No verification body', value: -1 }, ...bodies] : bodies,
      ),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.currentVerificationBody$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((value) => !!value),
      )
      .subscribe((verificationBody) => {
        this.form.get('verificationBodyId').setValue(verificationBody.id);
        this.form
          .get('verificationBodyId')
          .setValidators([
            GovukValidators.required('Select a verification body'),
            GovukValidators.builder(
              'This verification body is already appointed. Please select another one.',
              (control: AbstractControl) => (control.value === verificationBody.id ? { duplicate: true } : null),
            ),
          ]);
      });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const value = this.form.value;

      this.appointedAccount$ = this.accountId$.pipe(
        first(),
        withLatestFrom(this.currentVerificationBody$),
        switchMap(([accountId, currentVerificationBody]) =>
          currentVerificationBody
            ? value?.verificationBodyId === -1
              ? this.accountVerificationBodyService.unappointVerificationBodyFromAccount(accountId)
              : this.accountVerificationBodyService.replaceVerificationBodyToAccount(accountId, value)
            : this.accountVerificationBodyService.appointVerificationBodyToAccount(accountId, value),
        ),
        switchMap(() => this.activeBodies$),
        map((bodies) => bodies.find((body) => body.value === value.verificationBodyId)),
        catchBadRequest(ErrorCodes.ACCOUNT1006, () =>
          this.accountId$.pipe(
            first(),
            switchMap((accountId) => this.businessErrorService.showError(appointedVerificationBodyError(accountId))),
          ),
        ),
        catchBadRequest(ErrorCodes.ACCOUNT1007, () =>
          this.accountId$.pipe(
            first(),
            switchMap((accountId) =>
              this.businessErrorService.showError(savePartiallyNotFoundOperatorError(accountId)),
            ),
          ),
        ),
        catchBadRequest(ErrorCodes.ACCOUNT1010, () =>
          this.accountId$.pipe(
            first(),
            switchMap((accountId) =>
              this.businessErrorService.showError(changeNotAllowedVerificationBodyError(accountId)),
            ),
          ),
        ),
        catchElseRethrow(
          (res: HttpErrorResponse) => res.status === HttpStatuses.NotFound,
          () =>
            this.accountId$.pipe(
              first(),
              withLatestFrom(this.currentVerificationBody$),
              switchMap(([accountId, currentVerificationBody]) =>
                this.businessErrorService.showError(
                  currentVerificationBody
                    ? savePartiallyNotFoundOperatorError(accountId)
                    : saveNotFoundVerificationBodyError(accountId),
                ),
              ),
            ),
        ),
      );
    } else {
      this.form.markAllAsTouched();
      this.cdr.detectChanges();
      this.isSummaryDisplayed$.next(true);
    }
  }
}
