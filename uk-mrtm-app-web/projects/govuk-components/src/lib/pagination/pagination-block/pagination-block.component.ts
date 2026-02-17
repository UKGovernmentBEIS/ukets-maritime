import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { GovukPaginationBlock } from './pagination-block.interface';

@Component({
  selector: 'govuk-pagination-block',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './pagination-block.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationBlockComponent {
  readonly previous = input<GovukPaginationBlock>();
  readonly next = input<GovukPaginationBlock>();
}
