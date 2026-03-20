import { ChangeDetectionStrategy, Component, input } from '@angular/core';
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
  standalone: true,
  templateUrl: './operator-account-summary-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorAccountSummaryInfoComponent {
  readonly summaryInfo = input<MrtmAccountDTO>();
  readonly formRouterLink = input('edit');
  readonly withRegistryId = input<boolean>();
  readonly editable = input(true);
}
