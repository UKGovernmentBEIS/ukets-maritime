import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MrtmAccountDTO } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { CountryPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-operator-account-summary-info',
  templateUrl: './operator-account-summary-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    LinkDirective,
    CountryPipe,
    GovukDatePipe,
  ],
})
export class OperatorAccountSummaryInfoComponent {
  @Input() summaryInfo: MrtmAccountDTO;
  @Input() formRouterLink = 'edit';
  @Input() withRegistryId: boolean;
  @Input() editable = true;
}
