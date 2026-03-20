import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PaymentProcessedRequestActionPayload } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { PAYMENT_METHOD_SELECT_OPTIONS } from '@shared/constants';
import { SelectOptionToTitlePipe } from '@shared/pipes';
import { PaymentStatusPipe } from '@shared/pipes/payment-status.pipe';

@Component({
  selector: 'mrtm-payment-success-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    CurrencyPipe,
    GovukDatePipe,
    PaymentStatusPipe,
    SelectOptionToTitlePipe,
  ],
  standalone: true,
  templateUrl: './payment-success-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentSuccessSummaryTemplateComponent {
  public readonly paymentMethods = PAYMENT_METHOD_SELECT_OPTIONS;
  public readonly header = input<string>('Payment summary');
  public readonly data = input<PaymentProcessedRequestActionPayload>();
  public readonly shouldDisplayAmount = input<boolean>(true);
}
