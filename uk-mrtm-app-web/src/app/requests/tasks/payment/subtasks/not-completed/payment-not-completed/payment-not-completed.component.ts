import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';

@Component({
  selector: 'mrtm-payment-not-completed',
  imports: [PageHeadingComponent, ReturnToTaskOrActionPageComponent],
  standalone: true,
  template: `
    <netz-page-heading>The payment task must be closed before you can proceed</netz-page-heading>
    <div>
      <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
      <netz-return-to-task-or-action-page />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentNotCompletedComponent {}
