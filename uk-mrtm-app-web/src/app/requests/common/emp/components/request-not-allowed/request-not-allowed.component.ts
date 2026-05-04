import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-request-not-allowed',
  imports: [PageHeadingComponent, ButtonDirective, PendingButtonDirective, ReturnToTaskOrActionPageComponent],
  standalone: true,
  template: `
    <netz-page-heading>You can only have one active request at any given time.</netz-page-heading>
    <button (click)="onClick()" govukSecondaryButton netzPendingButton type="button">View the active request</button>
    <div>
      <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible" aria-hidden="true" />
      <netz-return-to-task-or-action-page />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestNotAllowedComponent {
  private readonly router = inject(Router);
  private readonly store = inject(RequestTaskStore);

  private readonly relatedTasks = this.store.select(requestTaskQuery.selectRelatedTasks)();

  public onClick(): void {
    const redirectTask = this.relatedTasks
      .sort((a, b) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime())
      .find((task) =>
        ['_WAIT_FOR_RDE_RESPONSE', '_WAIT_FOR_RFI_RESPONSE']
          .map((suffix) => task.taskType.endsWith(suffix))
          .includes(true),
      );

    this.router.navigate(['/tasks', redirectTask?.taskId]);
  }
}
