import { Directive, HostBinding, inject, Input, OnInit } from '@angular/core';

import { SummaryListComponent } from '@netz/govuk-components';

@Directive({
  selector: '[govuk-summary-list][mrtmGroupedSummaryList]',
  standalone: true,
})
export class GroupedSummaryListDirective implements OnInit {
  private readonly summaryList = inject(SummaryListComponent);

  @Input() hasBottomBorder = true;

  @HostBinding('class.summary-list--edge-border') get edgeBorder() {
    return true;
  }
  @HostBinding('class.summary-list--no-bottom-border') get noBottomBorder() {
    return !this.hasBottomBorder;
  }

  ngOnInit(): void {
    this.summaryList.hasBorders = false;
  }
}
