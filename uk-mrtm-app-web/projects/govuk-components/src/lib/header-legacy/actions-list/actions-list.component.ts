import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'govuk-header-actions-list',
  standalone: true,
  template: `
    <div class="header-actions">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderActionsListComponent {}
