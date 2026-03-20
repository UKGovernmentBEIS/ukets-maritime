import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { ReturnToOperatorForChangesStore } from '@requests/tasks/aer-verification-submit/return-to-operator-for-changes/+state';

@Component({
  selector: 'mrtm-return-to-operator-for-changes-success',
  imports: [PanelComponent, RouterLink, LinkDirective],
  standalone: true,
  templateUrl: './return-to-operator-for-changes-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnToOperatorForChangesSuccessComponent implements OnDestroy {
  private readonly store = inject(ReturnToOperatorForChangesStore);

  ngOnDestroy(): void {
    this.store.reset();
  }
}
