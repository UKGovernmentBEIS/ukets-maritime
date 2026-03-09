import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-peer-review-action-buttons',
  standalone: true,
  imports: [ButtonDirective, RouterLink],
  template: `
    @if (canBeDisplayed) {
      <div class="govuk-button-group">
        <a govukButton [routerLink]="['peer-review', 'decision']">Peer review decision</a>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeerReviewActionButtonsComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  canBeDisplayed = this.store.select(requestTaskQuery.selectIsEditable)();
}
