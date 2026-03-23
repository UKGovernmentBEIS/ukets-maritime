import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { accountClosureSubmittedQuery } from '@requests/timeline/account-closure-submitted/+state';
import { AccountClosureSubmittedSummaryTemplateComponent } from '@shared/components';
import { AccountClosureDto } from '@shared/types';

@Component({
  selector: 'mrtm-account-closure-submitted',
  standalone: true,
  imports: [AccountClosureSubmittedSummaryTemplateComponent],
  templateUrl: './account-closure-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountClosureSubmittedComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  public readonly vm: Signal<AccountClosureDto> = this.store.select(
    accountClosureSubmittedQuery.selectAccountClosureDto,
  );
}
