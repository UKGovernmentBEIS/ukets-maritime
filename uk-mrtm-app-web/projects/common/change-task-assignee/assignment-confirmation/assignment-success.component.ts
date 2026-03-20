import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BaseSuccessComponent } from '@netz/common/components';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'netz-assignment-success',
  imports: [PanelComponent, LinkDirective, RouterLink],
  standalone: true,
  template: `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        @if (user(); as user) {
          <govuk-panel title="The task has been reassigned to">{{ user }}</govuk-panel>
          <h3 class="govuk-heading-m">What happens next</h3>
          <p class="govuk-body">The task will appear in the dashboard of the person it has been assigned to</p>
        } @else {
          <govuk-panel title="This task has been unassigned" />
          <h3 class="govuk-heading-m">What happens next</h3>
          <p class="govuk-body">The task will appear in the unassigned tab of your dashboard</p>
        }
        <ng-template #unassigned>
          <govuk-panel title="This task has been unassigned" />
          <h3 class="govuk-heading-m">What happens next</h3>
          <p class="govuk-body">The task will appear in the unassigned tab of your dashboard</p>
        </ng-template>
        <a govukLink routerLink="/dashboard">Return to: Dashboard</a>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignmentSuccessComponent extends BaseSuccessComponent {
  private readonly store = inject(RequestTaskStore);

  protected user = this.store.select(requestTaskQuery.selectTaskReassignedTo);

  constructor() {
    super();
  }
}
