import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ItemDTO } from '@mrtm/api';

import { DaysRemainingPipe, ItemLinkPipe, ItemNamePipe } from '@netz/common/pipes';
import { getYearFromRequestId } from '@netz/common/utils';

@Component({
  selector: 'netz-related-tasks',
  standalone: true,
  templateUrl: './related-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ItemNamePipe, ItemLinkPipe, DaysRemainingPipe],
})
export class RelatedTasksComponent {
  readonly router = inject(Router);

  @Input() items: ItemDTO[];
  @Input() heading = 'Related tasks';
  @Input() noBorders = false;

  readonly getYearFromRequestId = getYearFromRequestId;
}
