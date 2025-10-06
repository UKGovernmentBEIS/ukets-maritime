import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { RegisteredOwnerShipDetails } from '@mrtm/api';

import { LinkDirective } from '@netz/govuk-components';

import { HTML_DIFF, HtmlDiffDirective } from '@shared/directives';
import { RegisteredOwnerShipDetailsPipe } from '@shared/pipes';
import { mergeDiffShipDetails } from '@shared/utils';

@Component({
  selector: 'mrtm-summary-registered-owner-ship-details',
  standalone: true,
  imports: [HtmlDiffDirective, LinkDirective, RegisteredOwnerShipDetailsPipe],
  templateUrl: './summary-registered-owner-ship-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryRegisteredOwnerShipDetailsComponent {
  protected readonly hasHtmlDiff = inject(HTML_DIFF, { optional: true });

  registeredOwnerUniqueIdentifier = input.required<string>();
  shipDetails = input.required<RegisteredOwnerShipDetails[]>();
  originalShipDetails = input<RegisteredOwnerShipDetails[]>(null);
  needsReview = input<boolean>(false);
  showDiff = input<boolean>(false);

  combinedShipDetails = computed(() => mergeDiffShipDetails(this.shipDetails(), this.originalShipDetails()));
  isExpanded = false;

  onToggleAssociatedShips(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isExpanded = !this.isExpanded;
  }
}
