import { Directive, inject, input, OnInit } from '@angular/core';

import { SummaryListComponent } from '@netz/govuk-components';

@Directive({
  selector: '[govuk-summary-list][mrtmGroupedSummaryList]',
  standalone: true,
  host: {
    '[class.summary-list--edge-border]': 'edgeBorder',
    '[class.summary-list--no-bottom-border]': 'noBottomBorder',
  },
})
export class GroupedSummaryListDirective implements OnInit {
  private readonly summaryList = inject(SummaryListComponent);

  readonly hasBottomBorder = input(true);

  get edgeBorder() {
    return true;
  }
  get noBottomBorder() {
    return !this.hasBottomBorder();
  }

  ngOnInit(): void {
    this.summaryList.hasBorders.set(false);
  }
}
