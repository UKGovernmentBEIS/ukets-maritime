import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  contentChildren,
  input,
  model,
  TemplateRef,
} from '@angular/core';

import {
  SummaryListColumnDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '../directives';
import { SummaryItem } from './summary-list.interface';

/*
  eslint-disable
  @angular-eslint/component-selector
 */
@Component({
  selector: 'dl[govuk-summary-list]',
  imports: [SummaryListRowKeyDirective, SummaryListRowDirective, NgTemplateOutlet, SummaryListRowValueDirective],
  standalone: true,
  templateUrl: './summary-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.govuk-summary-list]': 'govukSummaryList',
    '[class.govuk-!-margin-bottom-9]': 'hasBottomMarginClass',
    '[class.govuk-summary-list--no-border]': 'govukSummaryListNoBorderClass',
  },
})
export class SummaryListComponent {
  readonly details = input<SummaryItem[]>();
  readonly hasBorders = model(true);
  readonly hasBottomMargin = input(true);

  readonly rows = contentChildren(SummaryListRowDirective);
  readonly columns = contentChildren(SummaryListColumnDirective);
  readonly keyTemplate = contentChild<TemplateRef<any>>('keyTemplate');
  readonly valueTemplate = contentChild<TemplateRef<any>>('valueTemplate');

  readonly govukSummaryList = true;
  get hasBottomMarginClass(): boolean {
    return this.hasBottomMargin();
  }
  get govukSummaryListNoBorderClass(): boolean {
    return !this.hasBorders();
  }
}
