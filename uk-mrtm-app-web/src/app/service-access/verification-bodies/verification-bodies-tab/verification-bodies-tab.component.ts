import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { take } from 'rxjs';

import { VerificationBodyUpdateStatusDTO } from '@mrtm/api';

import { FeedbackBannerStore } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { BusinessErrorService, catchBadRequest, ErrorCodes } from '@netz/common/error';
import { ButtonDirective } from '@netz/govuk-components';

import {
  selectIsEditableVerificationBodiesList,
  selectVerificationBodiesListItems,
} from '@service-access/verification-bodies/+state/verification-bodies.selectors';
import { VerificationBodiesStoreService } from '@service-access/verification-bodies/+state/verification-bodies-store.service';
import { VerificationBodiesListComponent } from '@service-access/verification-bodies/components';
import { viewNotFoundVerificationBodyError } from '@service-access/verification-bodies/errors/business-error';
import {
  buildVerificationBodiesFormArray,
  createVerificationBodiesFormProvider,
  VERIFICATION_BODIES_FORM,
} from '@service-access/verification-bodies/verification-bodies.form-provider';
import { FormUtils } from '@shared/utils';

@Component({
  selector: 'mrtm-verification-bodies-tab',
  imports: [AsyncPipe, ButtonDirective, ReactiveFormsModule, VerificationBodiesListComponent, PendingButtonDirective],
  standalone: true,
  templateUrl: './verification-bodies-tab.component.html',
  providers: [createVerificationBodiesFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationBodiesTabComponent implements OnInit {
  public readonly formGroup: UntypedFormGroup = inject<UntypedFormGroup>(VERIFICATION_BODIES_FORM);
  private readonly formBuilder = inject(FormBuilder);
  private readonly store: VerificationBodiesStoreService = inject(VerificationBodiesStoreService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly feedbackBannerStore = inject(FeedbackBannerStore);
  private readonly businessErrorService = inject(BusinessErrorService);
  readonly editable$ = this.store.pipe(selectIsEditableVerificationBodiesList);
  readonly verificationBodies$ = this.store.pipe(selectVerificationBodiesListItems);

  public handleAddNewVerificationBody(): void {
    this.router.navigate(['verification-bodies', 'add'], { relativeTo: this.activatedRoute });
  }

  public ngOnInit(): void {
    // Rendered inside a lazy tab, so the load that used to run in the route
    // guard happens on first tab activation instead
    this.store.loadVerificationBodies().pipe(take(1)).subscribe();

    // The form array is rebuilt (not just reset) because the list arrives
    // after the injected form was created
    this.verificationBodies$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((verificationBodies) => {
      this.formGroup.setControl(
        'verificationBodies',
        buildVerificationBodiesFormArray(this.formBuilder, verificationBodies ?? []),
      );
    });
  }

  public handleFormSubmit(): void {
    const verificationBodiesStatuses: VerificationBodyUpdateStatusDTO[] = (
      this.formGroup.get('verificationBodies').value as VerificationBodyUpdateStatusDTO[]
    ).filter((verificationBody) => verificationBody.status !== 'PENDING');
    if (!this.formGroup.valid || !this.formGroup.dirty || verificationBodiesStatuses.length === 0) {
      return;
    }

    this.store
      .updateVerificationBodiesStatuses(verificationBodiesStatuses)
      .pipe(
        take(1),
        catchBadRequest(ErrorCodes.VERBODY1002, () =>
          this.businessErrorService.showError(viewNotFoundVerificationBodyError),
        ),
      )
      .subscribe(() => {
        if (FormUtils.findDirtyControlsKeys(this.formGroup).includes('status')) {
          this.feedbackBannerStore.setSuccessMessages(['Account status updated']);
        }
        this.formGroup.markAsPristine();
      });
  }

  public handleDiscardChanges(): void {
    if (!this.formGroup.dirty) {
      return;
    }

    this.store.loadVerificationBodies().pipe(take(1)).subscribe();
  }
}
