import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { RequestActionInfoDTO } from '@mrtm/api';

import { GovukDatePipe, ITEM_ACTIONS_MAP, ItemActionHeaderPipe, ItemActionsMap } from '@netz/common/pipes';
import { getYearFromRequestId } from '@netz/common/utils';
import { LinkDirective } from '@netz/govuk-components';

@Component({
  selector: 'netz-timeline-item',
  standalone: true,
  template: `
    <div class="govuk-body govuk-!-margin-bottom-0">
      <h3 class="govuk-heading-s govuk-!-margin-bottom-1">
        {{ action() | itemActionHeader: getYearFromRequestId(requestId()) }}
      </h3>
      <p class="govuk-body govuk-!-margin-bottom-1">{{ action().creationDate | govukDate: 'datetime' }}</p>
      @if (isLinkable() && link()) {
        <a [routerLink]="link()" [relativeTo]="route" [state]="state()" govukLink>View details</a>
      }
    </div>
    <hr class="govuk-!-margin-top-4 govuk-!-margin-bottom-3" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ItemActionHeaderPipe, GovukDatePipe, RouterLink, LinkDirective],
})
export class TimelineItemComponent {
  protected readonly route = inject(ActivatedRoute);
  private readonly itemActionsMap = inject<ItemActionsMap>(ITEM_ACTIONS_MAP);

  action = input<RequestActionInfoDTO>();
  link = input<any[]>();
  state = input<any>();
  requestId = input<string>();
  isLinkable = computed(() => this.itemActionsMap[this.action().type]?.linkable);

  readonly getYearFromRequestId = getYearFromRequestId;
}
