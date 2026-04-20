import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RequestActionStore } from '@netz/common/store';
import { LinkDirective } from '@netz/govuk-components';

import { rdeRegulatorDecisionQuery } from '@requests/timeline/rde-regulator-decision/+state';
import { RdeRegulatorDecisionSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-rde-regulator-decision',
  standalone: true,
  imports: [RdeRegulatorDecisionSummaryTemplateComponent, RouterLink, LinkDirective],
  templateUrl: './rde-regulator-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RdeRegulatorDecisionComponent {
  private readonly store = inject(RequestActionStore);
  readonly rdeForceDecision = this.store.select(rdeRegulatorDecisionQuery.selectRdeForceDecision)();
}
