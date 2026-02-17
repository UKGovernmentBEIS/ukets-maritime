import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ItemDTO } from '@mrtm/api';

import { DaysRemainingPipe, ItemLinkPipe, ItemNamePipe } from '@netz/common/pipes';
import { getYearFromRequestId } from '@netz/common/utils';

@Component({
  selector: 'netz-related-tasks',
  imports: [RouterLink, ItemNamePipe, ItemLinkPipe, DaysRemainingPipe],
  standalone: true,
  templateUrl: './related-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelatedTasksComponent {
  readonly router = inject(Router);

  readonly items = input<ItemDTO[]>();
  readonly heading = input('Related tasks');
  readonly noBorders = input(false);

  readonly getYearFromRequestId = getYearFromRequestId;
}
