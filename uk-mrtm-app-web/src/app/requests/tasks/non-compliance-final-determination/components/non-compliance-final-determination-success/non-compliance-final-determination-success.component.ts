import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';
import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { nonComplianceFinalDeterminationQuery } from '@requests/tasks/non-compliance-final-determination/+state';

@Component({
  selector: 'mrtm-non-compliance-final-determination-success',
  standalone: true,
  imports: [RouterLink, PanelComponent, LinkDirective],
  templateUrl: './non-compliance-final-determination-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceSuccessComponent {
  private readonly store = inject(RequestTaskStore);
  readonly nonComplianceFinalDetermination = this.store.select(
    nonComplianceFinalDeterminationQuery.selectNonComplianceFinalDetermination,
  );
}
