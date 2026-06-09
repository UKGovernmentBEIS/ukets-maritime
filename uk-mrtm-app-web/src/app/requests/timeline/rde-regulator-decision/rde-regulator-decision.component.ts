import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { rdeRegulatorDecisionQuery } from '@requests/timeline/rde-regulator-decision/+state';
import { RdeRegulatorDecisionSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-rde-regulator-decision',
  imports: [RdeRegulatorDecisionSummaryTemplateComponent],
  standalone: true,
  template: '<mrtm-rde-regulator-decision-summary-template [data]="rdeForceDecision" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RdeRegulatorDecisionComponent {
  private readonly store = inject(RequestActionStore);
  readonly rdeForceDecision = this.store.select(rdeRegulatorDecisionQuery.selectRdeForceDecision)();
}
