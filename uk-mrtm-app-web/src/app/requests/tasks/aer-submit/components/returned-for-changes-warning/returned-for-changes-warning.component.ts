import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { LinkDirective, WarningTextComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-returned-for-changes-warning',
  standalone: true,
  imports: [WarningTextComponent, LinkDirective, RouterLink],
  templateUrl: './returned-for-changes-warning.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnedForChangesWarningComponent {
  protected readonly route = inject(ActivatedRoute);
  private readonly store = inject(RequestTaskStore);

  readonly returnedForChangesTimelineEntry = computed(() => {
    const latestEntry = this.store.select(requestTaskQuery.selectTimeline)()?.[0];
    return latestEntry?.type === 'AER_VERIFICATION_RETURNED_TO_OPERATOR' ? latestEntry : null;
  });
}
