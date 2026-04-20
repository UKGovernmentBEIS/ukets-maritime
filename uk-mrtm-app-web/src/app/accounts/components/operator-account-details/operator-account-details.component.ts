import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { OperatorAccountsStore, selectAccount } from '@accounts/store';
import { CountryPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-operator-account-details',
  templateUrl: './operator-account-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
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
export class OperatorAccountDetailsComponent {
  @Input() editable: boolean = true;
  @Input() formRouterLink = 'edit';
  private readonly store: OperatorAccountsStore = inject(OperatorAccountsStore);
  accountInfo$ = this.store.pipe(selectAccount);
}
