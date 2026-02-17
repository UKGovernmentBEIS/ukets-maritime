import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { nonComplianceClosedQuery } from '@requests/timeline/non-compliance-closed/+state';
import { NonComplianceCloseSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-non-compliance-closed',
  imports: [NonComplianceCloseSummaryTemplateComponent],
  standalone: true,
  template: `
    <mrtm-non-compliance-close-summary-template [reason]="reason()" [files]="attachedFiles()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceClosedComponent {
  private readonly store = inject(RequestActionStore);

  readonly reason = this.store.select(nonComplianceClosedQuery.selectReason);
  readonly attachedFiles = computed(() =>
    this.store.select(
      nonComplianceClosedQuery.selectAttachedFiles(this.store.select(nonComplianceClosedQuery.selectFiles)()),
    )(),
  );
}
