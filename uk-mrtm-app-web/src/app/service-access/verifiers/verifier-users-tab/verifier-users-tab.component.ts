import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { EMPTY, take } from 'rxjs';

import { FeedbackBannerStore } from '@netz/common/components';
import { BusinessErrorService, catchBadRequest, ErrorCodes } from '@netz/common/error';

import {
  selectIsEditableVerifierUsersList,
  selectVerifierUsersListItems,
} from '@service-access/verifiers/+state/verifier-user.selectors';
import { VerifierUserStore } from '@service-access/verifiers/+state/verifier-user.store';
import { VerifierUsersListComponent } from '@shared/components';
import { savePartiallyNotFoundVerifierError } from '@shared/errors';
import { FormUtils } from '@shared/utils/form.utils';

@Component({
  selector: 'mrtm-verifier-users-tab',
  imports: [AsyncPipe, VerifierUsersListComponent],
  standalone: true,
  templateUrl: './verifier-users-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifierUsersTabComponent {
  private readonly businessErrorService = inject(BusinessErrorService);
  private readonly store: VerifierUserStore = inject(VerifierUserStore);
  private readonly feedbackBannerStore = inject(FeedbackBannerStore);

  public readonly authorities$ = this.store.pipe(selectVerifierUsersListItems);
  public readonly verifiersEditable$ = this.store.pipe(selectIsEditableVerifierUsersList);

  public onSave({ authoritiesToUpdate, form }) {
    const dirtyControls = FormUtils.findDirtyControlsKeys(form);
    this.store
      .updateVerifierUsers(authoritiesToUpdate)
      .pipe(
        take(1),
        catchBadRequest(ErrorCodes.AUTHORITY1006, () =>
          this.businessErrorService.showError(savePartiallyNotFoundVerifierError),
        ),
        catchBadRequest(ErrorCodes.AUTHORITY1007, () => {
          (form as FormGroup).setErrors({ noAdmin: 'You must have an active verifier admin on your account' });
          this.feedbackBannerStore.setInvalidForm(form);
          this.onDiscardChanges();
          return EMPTY;
        }),
      )
      .subscribe(() => {
        const successMessages = dirtyControls.map((key) => {
          let message = '';
          if (key === 'authorityStatus') {
            message = 'Account status';
          } else if (key === 'roleCode') {
            message = 'User type';
          }
          return `${message} updated`;
        });
        this.feedbackBannerStore.setSuccessMessages(successMessages);
      });
  }

  public onDiscardChanges() {
    this.store.loadVerifierUsers().pipe(take(1)).subscribe();
  }
}
