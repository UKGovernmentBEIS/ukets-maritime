import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { empReviewQuery } from '@requests/common/emp/+state';

@Component({
  selector: 'mrtm-emp-review-action-buttons',
  standalone: true,
  imports: [ButtonDirective, RouterLink],
  template: `
    @if (isEditable) {
      <div class="govuk-button-group">
        @if (isOverallDecisionCompleted) {
          <a govukButton [routerLink]="['emp-review', 'notify-operator']">Notify operator of decision</a>
          <a govukSecondaryButton [routerLink]="['emp-review', 'peer-review']">Send for peer review</a>
        }
        @if (hasOperatorAmendsNeeded) {
          <a govukButton [routerLink]="['emp-review', 'return-for-amends']">Return for amends</a>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpReviewActionButtonsComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  isEditable = this.store.select(requestTaskQuery.selectIsEditable)();
  hasOperatorAmendsNeeded = this.store.select(empReviewQuery.selectAnySubtaskNeedsAmend)();
  isOverallDecisionCompleted = this.store.select(empReviewQuery.selectIsOverallDecisionCompleted)();
}
