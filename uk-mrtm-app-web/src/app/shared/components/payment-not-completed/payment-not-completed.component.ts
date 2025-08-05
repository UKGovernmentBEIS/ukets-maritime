import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeadingComponent } from '@netz/common/components';

@Component({
  selector: 'mrtm-payment-not-completed',
  template: `
    <netz-page-heading>The payment task must be closed before you can proceed</netz-page-heading>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeadingComponent],
})
export class PaymentNotCompletedComponent {}
