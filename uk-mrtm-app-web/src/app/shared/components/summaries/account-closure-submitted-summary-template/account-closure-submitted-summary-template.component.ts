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
  imports: [
    GovukDatePipe,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
  ],
  standalone: true,
  templateUrl: './account-closure-submitted-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountClosureSubmittedSummaryTemplateComponent {
  readonly accountClosure = input.required<AccountClosureDto>();
}
