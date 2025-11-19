import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';

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
import { PaymentDetailsDto } from '@shared/types';

@Component({
  selector: 'mrtm-payment-details-summary-template',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    GovukDatePipe,
    CurrencyPipe,
    PaymentStatusPipe,
    SelectOptionToTitlePipe,
  ],
  templateUrl: './payment-details-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentDetailsSummaryTemplateComponent {
  public readonly header: InputSignal<string> = input<string>('Payment details');
  public readonly data: InputSignal<PaymentDetailsDto> = input<PaymentDetailsDto>();
  protected readonly PAYMENT_METHOD_SELECT_OPTIONS = PAYMENT_METHOD_SELECT_OPTIONS;
}
