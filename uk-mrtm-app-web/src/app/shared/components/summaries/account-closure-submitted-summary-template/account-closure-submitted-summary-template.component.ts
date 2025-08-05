import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { AccountClosureDto } from '@shared/types';

@Component({
  selector: 'mrtm-account-closure-submitted-summary-template',
  standalone: true,
  imports: [
    GovukDatePipe,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
  ],
  templateUrl: './account-closure-submitted-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountClosureSubmittedSummaryTemplateComponent {
  accountClosure = input.required<AccountClosureDto>();
}
