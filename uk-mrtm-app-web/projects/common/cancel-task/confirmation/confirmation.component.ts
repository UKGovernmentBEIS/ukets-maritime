import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BaseSuccessComponent } from '@netz/common/components';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { CANCEL_ACTION_SUCCESS_COMPONENT, CancelSuccessComponentMap } from '../cancel-actions.providers';

@Component({
  selector: 'netz-cancel-confirmation',
  imports: [RouterLink, LinkDirective, PanelComponent, NgComponentOutlet],
  standalone: true,
  template: `
    @if (successComponent) {
      <ng-container *ngComponentOutlet="successComponent" />
    } @else {
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <govuk-panel title="Task cancelled" />
        </div>
      </div>
      <a govukLink routerLink="/dashboard">Return to: Dashboard</a>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationComponent extends BaseSuccessComponent {
  private readonly successComponentMap: CancelSuccessComponentMap = inject<CancelSuccessComponentMap>(
    CANCEL_ACTION_SUCCESS_COMPONENT,
    { optional: true },
  );
  private readonly requestTaskStore = inject(RequestTaskStore);

  public readonly successComponent =
    this.successComponentMap?.[this.requestTaskStore.select(requestTaskQuery.selectRequestTaskType)()];
}
