import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { BankAccountDetailsDTO } from '@mrtm/api';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';
@Component({
  selector: 'mrtm-international-payment-details-summary-template',
  imports: [SummaryListComponent, SummaryListRowDirective, SummaryListRowKeyDirective, SummaryListRowValueDirective],
  standalone: true,
  templateUrl: './international-payment-details-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternationalPaymentDetailsSummaryTemplateComponent {
  public readonly data = input<BankAccountDetailsDTO>();
}
