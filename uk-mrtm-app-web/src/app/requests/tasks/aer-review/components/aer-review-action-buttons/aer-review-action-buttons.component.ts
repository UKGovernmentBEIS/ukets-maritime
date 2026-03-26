import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { aerReviewQuery } from '@requests/tasks/aer-review/+state';

@Component({
  selector: 'mrtm-aer-review-action-buttons',
  imports: [RouterLink, ButtonDirective],
  standalone: true,
  templateUrl: './aer-review-action-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerReviewActionButtonsComponent {
  private readonly store = inject(RequestTaskStore);
  private readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  public readonly canCompleteReport = this.store.select(aerReviewQuery.selectCanCompleteReport);
  public readonly canReturnForAmends = this.store.select(aerReviewQuery.selectCanReturnForAmends);

  public readonly hasAvailableActions = computed(() => {
    return this.isEditable() && (this.canCompleteReport() || this.canReturnForAmends());
  });
}
