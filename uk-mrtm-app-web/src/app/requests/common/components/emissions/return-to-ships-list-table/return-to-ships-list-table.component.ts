import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { LinkDirective } from '@netz/govuk-components';

import { EMISSIONS_SUB_TASK_PATH } from '@requests/common/components/emissions/emissions.helpers';
import { emissionsSubtaskMap } from '@requests/common/components/emissions/emissions-subtask-list.map';

@Component({
  selector: 'mrtm-return-to-ships-list-table',
  standalone: true,
  imports: [LinkDirective, RouterLink],
  template: `
    <div>
      <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible" aria-hidden="true" />
      <a govukLink [routerLink]="returnToUrl()">Return to: {{ label() }}</a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnToShipsListTableComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly label = input<string>(emissionsSubtaskMap.title);
  readonly returnToUrl = signal(['/']);

  constructor() {
    const currentRoutePaths = this.route.snapshot.pathFromRoot.map((route) => route.url.map((u) => u.path)).flat();
    const index = currentRoutePaths.indexOf(EMISSIONS_SUB_TASK_PATH);
    if (index > -1) {
      this.returnToUrl.set(['/', ...currentRoutePaths.slice(0, index + 1)]);
    }
  }
}
