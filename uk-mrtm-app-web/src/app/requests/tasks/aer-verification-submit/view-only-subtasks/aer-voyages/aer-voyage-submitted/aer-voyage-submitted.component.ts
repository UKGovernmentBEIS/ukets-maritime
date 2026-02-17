import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageHeadingComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';
import { LinkDirective } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { aerVoyagesMap } from '@requests/common/aer/subtasks/aer-voyages';
import { VoyageSummaryTemplateComponent } from '@shared/components/summaries/ports-and-voyages/voyage-summary-template/voyage-summary-template.component';

@Component({
  selector: 'mrtm-aer-voyage-submitted',
  imports: [VoyageSummaryTemplateComponent, RouterLink, LinkDirective, PageHeadingComponent],
  standalone: true,
  templateUrl: './aer-voyage-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerVoyageSubmittedComponent {
  private readonly store = inject(RequestTaskStore);
  readonly map = aerVoyagesMap;
  readonly voyageId = input<string>();
  readonly voyage = computed(() => this.store.select(aerCommonQuery.selectVoyage(this.voyageId()))());
  readonly ship = computed(() => this.store.select(aerCommonQuery.selectRelatedShipForVoyage(this.voyageId()))());
}
