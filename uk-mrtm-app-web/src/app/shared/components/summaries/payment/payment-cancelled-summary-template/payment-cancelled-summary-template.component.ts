import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { PaymentStatusPipe } from '@shared/pipes/payment-status.pipe';
import { PaymentDetailsDto } from '@shared/types';

@Component({
  selector: 'mrtm-payment-cancelled-summary-template',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    PaymentStatusPipe,
  ],
  templateUrl: './payment-cancelled-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentCancelledSummaryTemplateComponent {
  public readonly data: InputSignal<PaymentDetailsDto> = input<PaymentDetailsDto>();
}
