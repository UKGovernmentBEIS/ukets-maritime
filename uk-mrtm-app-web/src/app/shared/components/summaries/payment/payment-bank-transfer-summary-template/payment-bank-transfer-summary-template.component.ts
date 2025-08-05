import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { PaymentBankAccountDetailsDto } from '@shared/types';

@Component({
  selector: 'mrtm-payment-bank-transfer-summary-template',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    CurrencyPipe,
  ],
  templateUrl: './payment-bank-transfer-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentBankTransferSummaryTemplateComponent {
  public readonly header: InputSignal<string> = input<string>("Environment Agency's bank details");
  public readonly data = input<PaymentBankAccountDetailsDto>();
}
