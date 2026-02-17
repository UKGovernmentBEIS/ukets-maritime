import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { ButtonDirective } from '@netz/govuk-components';

import { FollowUpAmendTaskPayload } from '@requests/tasks/notification-follow-up-amend/follow-up-amend.types';

@Component({
  selector: 'mrtm-follow-up-amend-submit-confirm',
  imports: [PageHeadingComponent, ButtonDirective, PendingButtonDirective, ReturnToTaskOrActionPageComponent],
  standalone: true,
  template: `
    <netz-page-heading size="xl">Submit to regulator</netz-page-heading>
    <p class="govuk-heading-m">Your Notification will be sent directly to your regulator</p>

    <p class="govuk-body">
      By selecting ‘Confirm and send’ you confirm that the information in your notification is correct to the best of
      your knowledge.
    </p>

    <div class="govuk-button-group">
      <button (click)="onSubmit()" govukButton netzPendingButton type="button">Confirm and send</button>
    </div>
    <div>
      <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible" aria-hidden="true" />
      <netz-return-to-task-or-action-page />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowUpAmendSubmitConfirmComponent {
  private readonly service = inject(TaskService<FollowUpAmendTaskPayload>);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  onSubmit() {
    this.service.submit().subscribe(() => {
      this.router.navigate(['success'], {
        relativeTo: this.route,
        skipLocationChange: true,
      });
    });
  }
}
