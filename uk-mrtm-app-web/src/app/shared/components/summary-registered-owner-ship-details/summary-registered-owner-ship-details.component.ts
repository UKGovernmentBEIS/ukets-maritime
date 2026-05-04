import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { RegisteredOwnerShipDetails } from '@mrtm/api';

import { LinkDirective } from '@netz/govuk-components';

import { HTML_DIFF, HtmlDiffDirective } from '@shared/directives';
import { mergeDiffShipDetails } from '@shared/utils';

@Component({
  selector: 'mrtm-summary-registered-owner-ship-details',
  imports: [HtmlDiffDirective, LinkDirective, NgTemplateOutlet],
  standalone: true,
  templateUrl: './summary-registered-owner-ship-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryRegisteredOwnerShipDetailsComponent {
  protected readonly hasHtmlDiff = inject(HTML_DIFF, { optional: true });

  readonly registeredOwnerUniqueIdentifier = input.required<string>();
  readonly shipDetails = input.required<RegisteredOwnerShipDetails[]>();
  readonly originalShipDetails = input<RegisteredOwnerShipDetails[]>(null);
  readonly needsReview = input<boolean>(false);
  readonly showDiff = input<boolean>(false);

  readonly combinedShipDetails = computed(() => mergeDiffShipDetails(this.shipDetails(), this.originalShipDetails()));
  isExpandedStates = new Map<string, boolean>();

  isExpanded() {
    return this.isExpandedStates.get(this.registeredOwnerUniqueIdentifier()) ?? false;
  }

  onToggleAssociatedShips(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isExpandedStates.set(this.registeredOwnerUniqueIdentifier(), !this.isExpanded());
  }
}
